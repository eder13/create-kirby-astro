<?php

function build() {
    $payload = get();
    $secret = $payload['secret'];

    if (($user = kirby()->user()) && $user->isLoggedIn()) {
        $env = parse_ini_file(__DIR__ . '/../../../../.env');
        $domain = $env["DOMAIN"];
        $deployment_key = $env["DEPLOYMENT_KEY"];
        $host = $_SERVER['HTTP_HOST'];

        if ($deployment_key != $secret || ($host != "localhost" && strcmp($host, $domain) != 0)) {
            return [
                'status' => 401,
                'message' => "Error: Invalid Secret or Domain.",
                'retval' => 1,
            ];
        }

        $ROOT = $_SERVER['DOCUMENT_ROOT'];
        $FE_DEPLOY_LOGS_DIR = $ROOT . "/frontend" . "/logs";
        $LOCK_FE_FILE = $ROOT . "/frontend" . "/deployment.lock";

        if (file_exists($LOCK_FE_FILE)) {
            return [
                'status' => 400,
                'message' => "You are not allowed to publish since currently a deployment is in progress.",
                'retval' => 1,
            ];
        }

        $BUILD_ASTRO_COMMAND = "echo '----- Generating build files -----' && export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin && export ASTRO_TELEMETRY_DISABLED=1 && cd ../frontend && DOMAIN=" . $_SERVER['HTTP_HOST'] . " DEPLOYMENT_KEY=" . $secret . " npm run build" . " > /dev/null 2>&1 &";
        exec($BUILD_ASTRO_COMMAND);

        return [
            'status' => 200,
            'message' => "Deployment created, please check the deployment indicator at the top.",
            'retval' => 0
        ];
    }

    return [
        'status' => 401,
        'message' => "Error: You are not authorized to access this resource.",
    ];
}

function status() {
    if (($user = kirby()->user()) && $user->isLoggedIn()) { 
        $LOCK_FE_FILE = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/deployment.lock";
        $ERROR_BUILD_FILE_EXISTS = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/error.build";
        $FE_DEPLOY_LOGS_DIR = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/logs";
        
        function distFolderBuiltExistsAndIsNotEmpty() {
            $FE_BUILT_FILES_FOLDER = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/dist";

            if (is_dir($FE_BUILT_FILES_FOLDER)) {
                // The directory exists, now check if it is not empty
                $files = scandir($FE_BUILT_FILES_FOLDER);
                
                // Remove '.' and '..' from the list of items
                $files = array_diff($files, array('.', '..'));
                
                if (count($files) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }

        if (!file_exists($LOCK_FE_FILE) && distFolderBuiltExistsAndIsNotEmpty()) { 
            return [
                'status' => 200,
                'message' => "Allowed to Publish!",
                'retval' => 0
            ];
        }

        if (file_exists($LOCK_FE_FILE)) {
            return [
                'status' => 204,
                'message' => 'Currently Building, please wait ...'
            ];
        }

        if (file_exists($ERROR_BUILD_FILE_EXISTS)) {
            unlink($ERROR_BUILD_FILE_EXISTS);

            return [
                'status' => 500,
                'message' => "The previous build failed. Please try again or contact the administrator.",
                'retval' => 1
            ];
        }
    } else {
        return [
            'status' => 401,
            'message' => "Error: You are not authorized to access this resource.",
        ];
    }

    return [
        'status' => 400,
        'message' => "Error: You are not allowed to publish.",
    ];
}

function after_build() {
    if (($user = kirby()->user()) && $user->isLoggedIn()) { 
        $ROOT = $_SERVER['DOCUMENT_ROOT'];
        $FE_BUILT_FILES_FOLDER = $ROOT . "/frontend" . "/dist";
        $LOCK_FE_FILE = $ROOT . "/frontend" . "/deployment.lock";
        $FE_DEPLOY_LOGS_DIR = $ROOT . "/frontend" . "/logs";
        
        function distFolderBuiltExistsAndIsNotEmpty() {
            $FE_BUILT_FILES_FOLDER = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/dist";

            if (is_dir($FE_BUILT_FILES_FOLDER)) {
                // The directory exists, now check if it is not empty
                $files = scandir($FE_BUILT_FILES_FOLDER);
                
                // Remove '.' and '..' from the list of items
                $files = array_diff($files, array('.', '..'));
                
                if (count($files) > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }

        // check if the dist folder is NOT empty --> if that is the case, a new deployment has been created and should be processed and no deployment.lock exists!
        if (!file_exists($LOCK_FE_FILE) && distFolderBuiltExistsAndIsNotEmpty()) {
            $output_failed = null;
            $retval_failed = null;

            $output = null;
            $retval = null;

            function createDeploymentLockFile() {
                $LOCK_FE_FILE = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/deployment.lock";
                if (file_put_contents($LOCK_FE_FILE, "") !== false) {
                    return true;
                } else {
                    return false;
                }
            }

            function deleteDeploymentLockFile() {
                $LOCK_FE_FILE = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/deployment.lock";
                if (file_exists($LOCK_FE_FILE)) {
                    if (unlink($LOCK_FE_FILE)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }

            function createLogFile($reason, $logs, $logs_retval, $output_failed_logs, $retval_failed_logs) {
                $FE_DEPLOY_LOGS_DIR = $_SERVER['DOCUMENT_ROOT'] . "/frontend" . "/logs";

                $now = new DateTime();
                $formattedDate = $now->format('Ymd_His') . sprintf('.%03d', intval($now->format('u') / 1000));
                $fileName = $FE_DEPLOY_LOGS_DIR . "/" . $formattedDate . "_after_deployment_steps.log";
                
                $logsArrayString = print_r($logs, true);
                $logsErrorArrayString = print_r($output_failed_logs, true);
                $logFileContent = "Possible Reason: " . $reason . "\n\nFailed Main Command: \n" . $logsArrayString . "\nRetval: " . $logs_retval . "\n\n\n" . "Final command in error mode: \n" . $logsErrorArrayString . "\nRetval: " . $retval_failed_logs;
                
                file_put_contents($fileName, $logFileContent);
            }

            /**
             * 1. Create deployment.lock file to indicate after deployment steps and block other processes
             */
            $CD_FRONTEND_BUILT = "echo '' && echo '----- Step 1: Changing into FE directory for after deployment steps -----' && cd ../frontend && echo '' 2>&1";
            exec($CD_FRONTEND_BUILT, $output, $retval);

            if (!createDeploymentLockFile() || $retval != 0 || $retval != "0") { 
                exec("echo '----- Step 1 Changing into FE directory for after deployment steps ***FAILED***", $output_failed, $retval_failed);
                $reason = "The deployment worked itself, but it could not create the deployment.lock file OR cd into the FE folder.";
                deleteDeploymentLockFile();
                createLogFile($reason, $output, $retval, $output_failed, $retval_failed);

                return [
                    'status' => 500,
                    'hint' => $reason,
                    'message' => array_merge($output, $output_failed),
                    'retval' => $retval,
                ];
            }

            /**
             * 2. Backup the files
             */
            $BACKUP_CURRENT_INDEX = "echo '' && echo '----- Step 2: Backing up current build files -----' && cd .. && test -d tmp && rm -R tmp || echo 'Creating tmp folder' && mkdir tmp && find . -type f -regextype posix-extended ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*)' -exec sh -c 'mkdir -p tmp/$(dirname \"{}\") && cp \"{}\" tmp/$(dirname \"{}\")/' \; && echo 'done!' && echo '' 2>&1";
            if (stripos(PHP_OS, 'LIN') !== 0) {
                $BACKUP_CURRENT_INDEX = "echo '' && echo '----- Step 2: Backing up current build files -----' && cd .. && test -d tmp && rm -R tmp || echo 'Creating tmp folder' && mkdir tmp && find -E . -type f ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*)' -exec sh -c 'mkdir -p tmp/$(dirname \"{}\") && cp \"{}\" tmp/$(dirname \"{}\")/' \; && echo 'done!' && echo '' 2>&1";
            }
            $output2 = null;
            $retval2 = null;
            exec($BACKUP_CURRENT_INDEX, $output2, $retval2);

            if ($retval2 != 0 || $retval2 != "0") {
                $CLEANUP_BACKUP = "echo '----- Step 2 backup ***FAILED***: Cleaning up -----' && cd .. && echo '' && test -d tmp && rm -R tmp || echo 'Folder tmp does not exist. Nothing to remove.' 2>&1";
                exec($CLEANUP_BACKUP, $output_failed, $retval_failed);

                $reason = "The deployment worked itself, but the backup failed and - to be better safe than sorry - will be aborted.";
                deleteDeploymentLockFile();
                createLogFile($reason, array_merge($output, $output2), $retval2, $output_failed, $retval_failed);

                return [
                    'status' => 500,
                    'hint' => $reason,
                    'message' => array_merge($output, $output2, $output_failed),
                    'retval' => $retval2,
                ];
            }

            /**
             * 3. Delete the current deployed built on the server with my extremely complicated remove statement
             */
            $DELETE_CURRENT_INDEX = "echo '----- Step 3: Deleting old build files which are currently deployed -----' && cd .. && find . -mindepth 1 -regextype posix-extended ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*|^\.\/README.*|^\.\/docs.*)' -exec rm -rf {} + && echo 'done!' && echo '' 2>&1";
            if (stripos(PHP_OS, 'LIN') !== 0) {
                $DELETE_CURRENT_INDEX = "echo '----- Step 3: Deleting old build files which are currently deployed -----' && cd .. && find -E . -mindepth 1 ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*|^\.\/README.*|^\.\/docs.*)' -exec rm -rf {} + && echo 'done!' && echo '' 2>&1";
            }
            $output3 = null; 
            $retval3 = null;
            exec($DELETE_CURRENT_INDEX, $output3, $retval3);

            if ($retval3 != 0 || $retval3 != "0") {
                $CLEANUP_DELETE = "echo '----- Step 3 deleting old build files ***FAILED***: Reverting to old build -----' && cd .. && mv tmp/* . && rm -R tmp";
                exec($CLEANUP_DELETE, $output_failed, $retval_failed);

                $reason = "The deployment worked itself, but the deletion of the current deployed files failed for whatever reason.";
                deleteDeploymentLockFile();
                createLogFile($reason, array_merge($output, $output2, $output3), $retval3, $output_failed, $retval_failed);

                return [
                    'status' => 500,
                    'hint' => $reason,
                    'message' => array_merge($output, $output2, $output3, $output_failed),
                    'retval' => $retval3,
                ];
            }

            /**
             * 4. Moving new build files from current deployment into the root directory which basically means deployment completed
             */
            $MOVE_CURRENT_INDEX = "echo '----- Step 4: Moving new build files into current root directory -----' && cd .. && mv frontend/dist/* . && rm -R tmp && echo 'Successfully replaced build files in root!' && echo '' && echo 'Deployment Succeeded! ☺︎' 2>&1";
            $output4 = null; 
            $retval4 = null;
            exec($MOVE_CURRENT_INDEX, $output4, $retval4);

            if ($retval4 != 0 || $retval4 != "0") {
                $CLEANUP_MOVE = "echo '----- Step 4 moving new build files ***FAILED***: Reverting to old build -----' && cd .. && mv tmp/* . && rm -R tmp";
                exec($CLEANUP_MOVE, $output_failed, $retval_failed);

                $reason = "The deployment worked itself, but could not move the newly generated files into the folder.";
                deleteDeploymentLockFile();
                createLogFile($reason, array_merge($output, $output2, $output3, $output4), $retval4, $output_failed, $retval_failed);

                return [
                    'status' => 500,
                    'hint' => $reason,
                    'message' => array_merge($output, $output2, $output3, $output4, $output_failed),
                    'retval' => $retval4,
                ];
            }

            deleteDeploymentLockFile();
            createLogFile("No Reason, everything went smoothly :D", array_merge($output, $output2, $output3, $output4), $retval4, "Everything fine :)", 0);

            return [
                'status' => 200,
                'message' => array_merge($output, $output2, $output3, $output4),
                'retval' => $retval4
            ];
        }
        else {
            return [
                'status' => 400,
                'message' => "Not able to execute after deployment steps.",
            ];
        }
    }

    return [
        'status' => 401,
        'message' => "Error: You are not allowed to access the resource.",
    ];
}

?>
