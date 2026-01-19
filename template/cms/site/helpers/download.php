<?php 
    /**
     * Transform all files and returns the filen ame, extension and download link.
     * 
     * @param $file_or_files - accepts either File (toFile) or Files (toFiles())
     * @return array - files objects as array or as a single object
     */
    function json_file($file_or_files) {
        if ($file_or_files == null) {
            return null;
        }

        if ($file_or_files instanceof Kirby\Cms\Files) {
            $filesArray = array();
            $files = $file_or_files;

            foreach($files as $file) {
                array_push($filesArray, array("name" => $file->filename(), "download" => $file->url(), "extension" => $file->extension()));
            }
            
            return $filesArray;
        }

        $file = $file_or_files;
        return array("name" => $file->filename(), "download" => $file->url(), "extension" => $file->extension());
    }
?>
