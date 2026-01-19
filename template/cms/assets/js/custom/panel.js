(async () => {
    /**
     * Constants
     */
    const deployBtnText = "Build";
    const deployBtnBuildingText = "Building ...";
    const publishBtnText = "Publish";
    const deployConfirmTextBtn = "Build Now 🚀";
    const deployConfirmWarningText =
        "Are you sure that you want to trigger a build now?";
    const deployIsDeployingLoaderText = "Build in Queue, please wait...";
    const deployConfirmTextRetryBtn = "Try again";
    const deploySuccessMsg = "The Build process has been started successfully!";
    const deployFailedNoAccessRights =
        "No Access Rights. Please ensure you have entered the secret correctly.";
    const deployFailedBuildError =
        "The Build failed. Please try again or contact the Administrator.";
    const getDeployFailedMsgWithCode = (code) =>
        `Deployment failed ❌<br/>Error Code: ${code}<br/>Please contact Administrator.`;
    let cancelingModalIsDisabled = false;

    /**
     * Version Info Text
     */
    const versionInfo = document.createElement("div");
    versionInfo.style.height = "50px";
    versionInfo.style.textAlign = "right";
    versionInfo.style.padding =
        "var(--spacing-3) var(--main-padding-inline) var(--spacing-24)";

    /**
     * Overlay
     */
    const overlayConfirmation = document.createElement("div");
    overlayConfirmation.className = "d-none";
    overlayConfirmation.id = "overlay-deployment";
    overlayConfirmation.style.width = "100dvw";
    overlayConfirmation.style.height = "100dvh";
    overlayConfirmation.style.display = "flex";
    overlayConfirmation.style.justifyContent = "center";
    overlayConfirmation.style.position = "absolute";
    overlayConfirmation.style.top = "0";
    overlayConfirmation.style.left = "0";
    overlayConfirmation.style.zIndex = 800;
    overlayConfirmation.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlayConfirmation.innerHTML = /*html*/ `
<div id="overlay-wrapper" style="background: #f4f4f4; width: ${
        window.innerWidth > 500 ? "70%" : "100%"
    }; padding: 20px">
    <header style="display: flex; justify-content: flex-end">
        <button style="padding: 5px" id="close-deployment">x</button>
        <br/>
        <br/>
        <br/>
        <br/>
    </header>
    <article>
        <div class="alert warning" id="overlay-warning-info-text">${deployConfirmWarningText}</div>
        <div class="alert info d-none" style="text-align: center" id="overlay-is-deploying-message">${deployIsDeployingLoaderText}</div>
        <div class="alert success d-none" style="text-align: center" id="deploy-success">${deploySuccessMsg}</div>
        <div class="alert danger d-none" style="text-align: center" id="deploy-failure"></div>
        <div class="alert danger d-none" style="text-align: center" id="build-failure"></div>
        <br/>
        <form id="form" style="display: grid; place-items: center">
          <br>
          <label for="secret">Deployment Secret: </label>  
          <br>
          <input style="
            width: 250px; 
            display: block;
            padding-bottom: 6px;
            padding-left: 12px;
            padding-right: 12px;
            padding-top: 6px;
            line-height: 24px;
            color: rgb(73, 80, 87);
            background-color: rgb(255, 255, 255);
            background-clip: padding-box;
            border: 1px solid rgb(206, 212, 218);
            border-radius: 4px"
          id="secret" name="secret" type="password" />
          <br>
          <button type="submit" class="deploy-button dark" id="confirmation-deployment">${deployConfirmTextBtn}</button>
        </form>
        <button onclick="this.classList.add('d-none');document.getElementById('loader-deployment').classList.remove('d-none'); fetch('/cms/ssg/deploy/after_deployment_steps', { method: 'post' }).then(res => res.json()).then(res => { document.getElementById('id-publish-btn').disabled = true; res.status === 200 ? document.getElementById('deploy-success').classList.remove('d-none') : document.getElementById('deploy-failure').classList.remove('d-none')}).catch(e => document.getElementById('deploy-failure').classList.remove('d-none')).finally(() => document.getElementById('loader-deployment').classList.add('d-none'))" class="publish-button dark d-none" id="confirmation-publish">Publish Changes</button>
        <div style="display: grid; place-items: center">
            <div id="loader-deployment" class="deploy-loader d-none"></div>
                <input type="checkbox" style="height: 24px; background-color: #777;color: white;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;" class="d-none" id="deploy-collapsible-button">
                <span style="transform: translateY(-16px)" class="arrow-right d-none" id="deploy-collapsible-icon-down"></span>
                <span style="transform: translateY(-16px)" class="arrow-down d-none" id="deploy-collapsible-icon-up"></span>
                <div style="padding: 18px;overflow-y: scroll;background-color: #eaeaea; max-height: 150px; max-width: 100%" class="d-none" id="deploy-collapsible-content">
                    <p></p>
                </div>
        </div>
    </article>
</div>
`;

    /**
     * Deploy Button
     */
    const deployBtnWrapper = document.createElement("div");
    deployBtnWrapper.style.color = "white";
    deployBtnWrapper.style.width = "100dvw";
    deployBtnWrapper.style.height = "50px";
    deployBtnWrapper.style.position = "absolute";
    deployBtnWrapper.style.top = "0";
    deployBtnWrapper.style.left = "0";
    deployBtnWrapper.style.display = "grid";
    deployBtnWrapper.style.placeItems = "center";
    deployBtnWrapper.style.cursor = "default";

    const deployBtn = document.createElement("button");
    deployBtn.style.marginBottom = "10px";
    deployBtn.className = "deploy-button";
    deployBtn.id = "id-deploy-btn";
    deployBtn.textContent = deployBtnText;

    const publishBtn = document.createElement("button");
    publishBtn.className = "publish-button";
    publishBtn.id = "id-publish-btn";
    publishBtn.disabled = true;
    publishBtn.textContent = publishBtnText;

    deployBtnWrapper.appendChild(deployBtn);
    deployBtnWrapper.appendChild(publishBtn);

    /**
     * Loader Building Icon
     */
    const buildingWrapper = document.createElement("div");
    buildingWrapper.id = "building-loader-indicator";
    buildingWrapper.style.display = "none";
    buildingWrapper.style.position = "absolute";
    buildingWrapper.style.left = "50%";
    buildingWrapper.style.transform = "scale(0.5)";
    buildingWrapper.style.height = "42px";
    buildingWrapper.style.placeItems = "center";
    buildingWrapper.innerHTML = `<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="deploy-loader"></div>`;

    /**
     * Selectors
     */
    const overlayWarningText = overlayConfirmation.querySelector(
        "#overlay-warning-info-text",
    );
    const overlayDeployingInProgress = overlayConfirmation.querySelector(
        "#overlay-is-deploying-message",
    );
    const overlayForm = overlayConfirmation.querySelector("#form");
    const secretDeploymentKeyInput =
        overlayConfirmation.querySelector("#secret");
    const overlayConfirmationBtn = overlayConfirmation.querySelector(
        "#confirmation-deployment",
    );
    const overlayLoader =
        overlayConfirmation.querySelector("#loader-deployment");
    const overlayFailure = overlayConfirmation.querySelector("#deploy-failure");
    const overlayBuildFailure =
        overlayConfirmation.querySelector("#build-failure");
    const overlaySuccess = overlayConfirmation.querySelector("#deploy-success");
    const overlayCollapsibleLogButton = overlayConfirmation.querySelector(
        "#deploy-collapsible-button",
    );
    const overlayCollapsibleLogContent = overlayConfirmation.querySelector(
        "#deploy-collapsible-content",
    );
    const overlayCollapsibleIconDown = overlayConfirmation.querySelector(
        "#deploy-collapsible-icon-down",
    );
    const overlayCollapsibleIconUp = overlayConfirmation.querySelector(
        "#deploy-collapsible-icon-up",
    );

    /**
     * Helpers
     */
    const escapeXSSHtml = (html) => {
        const scriptOpeningTagRegEx = /<script[\s\S]*?>/gi;
        const scriptClosingTagRegex = /<\/script[\s\S]*?>/gi;

        const escaped = html.replace(scriptOpeningTagRegEx, "");
        return escaped.replace(scriptClosingTagRegex, "");
    };

    const generateList = (arr) => {
        const liElements = arr.map((item) => `<li>${escapeXSSHtml(item)}</li>`);
        const ulString = `<ul>${liElements.join("")}</ul>`;
        return ulString;
    };

    /**
     * Callbacks
     */
    function onClose() {
        if (!cancelingModalIsDisabled) {
            overlayConfirmation.classList.add("d-none");
            overlaySuccess.classList.add("d-none");
            overlayFailure.classList.add("d-none");
            overlayBuildFailure.classList.add("d-none");
            overlayForm.classList.remove("d-none");
            secretDeploymentKeyInput.value = "";
            overlayWarningText.classList.remove("d-none");

            overlayConfirmationBtn.classList.remove("d-none");
            overlayLoader.classList.add("d-none");
            overlayDeployingInProgress.classList.add("d-none");
            overlayCollapsibleLogButton.classList.add("d-none");
            overlayCollapsibleIconDown.classList.add("d-none");
            overlayCollapsibleIconUp.classList.add("d-none");
            overlayCollapsibleLogContent.classList.add("d-none");
            overlayConfirmationBtn.textContent = deployConfirmTextBtn;
            document.body.style.height = "auto";
            document.body.style.overflow = "auto";

            // check the status once again after closing the overlay quickly
            pollServer();
        }
    }

    function showOverlay(type) {
        document.body.style.height = "100svh";
        document.body.style.overflow = "hidden";

        if (type === "deploy") {
            document
                .getElementById("confirmation-publish")
                .classList.add("d-none");
            overlayConfirmationBtn.classList.remove("d-none");
            overlayForm.classList.remove("d-none");
            overlayConfirmation.classList.remove("d-none");
            overlaySuccess.classList.add("d-none");
            overlayFailure.classList.add("d-none");
            overlayBuildFailure.classList.add("d-none");
            overlayCollapsibleLogButton.classList.add("d-none");

            overlayCollapsibleIconDown.classList.add("d-none");
            overlayCollapsibleIconUp.classList.add("d-none");
            overlayCollapsibleLogContent.classList.add("d-none");
            overlayLoader.classList.add("d-none");
            overlayDeployingInProgress.classList.add("d-none");
            overlayWarningText.classList.remove("d-none");
            overlayConfirmationBtn.textContent = deployConfirmTextBtn;

            document.getElementById("deploy-failure").textContent = "";
            document.getElementById("deploy-success").textContent =
                deploySuccessMsg;
        } else if (type === "publish") {
            overlayConfirmationBtn.classList.remove("d-none");
            overlayForm.classList.add("d-none");
            overlayConfirmation.classList.remove("d-none");
            overlaySuccess.classList.add("d-none");
            overlayFailure.classList.add("d-none");
            overlayBuildFailure.classList.add("d-none");
            overlayCollapsibleLogButton.classList.add("d-none");

            overlayCollapsibleIconDown.classList.add("d-none");
            overlayCollapsibleIconUp.classList.add("d-none");
            overlayCollapsibleLogContent.classList.add("d-none");
            overlayLoader.classList.add("d-none");
            overlayDeployingInProgress.classList.add("d-none");
            overlayWarningText.classList.remove("d-none");
            overlayConfirmationBtn.textContent = "Publish";

            document.getElementById("overlay-warning-info-text").textContent =
                "Do you want to publish the changes now? Note that this could make the site inaccessible for a few minutes.";
            document.getElementById("deploy-failure").textContent =
                "An unexpected error occured - please contact the administrator.";
            document.getElementById("deploy-success").textContent =
                "The changes have been published successfully! 🥳🎊🍾";
            document
                .getElementById("confirmation-publish")
                .classList.remove("d-none");
        } else if (type === "error") {
            document
                .getElementById("confirmation-publish")
                .classList.add("d-none");
            overlayConfirmationBtn.classList.remove("d-none");
            overlayForm.classList.remove("d-none");
            overlayConfirmation.classList.remove("d-none");
            overlaySuccess.classList.add("d-none");
            overlayFailure.classList.add("d-none");
            overlayBuildFailure.classList.add("d-none");
            overlayCollapsibleLogButton.classList.add("d-none");

            overlayCollapsibleIconDown.classList.add("d-none");
            overlayCollapsibleIconUp.classList.add("d-none");
            overlayCollapsibleLogContent.classList.add("d-none");
            overlayLoader.classList.add("d-none");
            overlayDeployingInProgress.classList.add("d-none");
            overlayWarningText.classList.remove("d-none");
            overlayConfirmationBtn.textContent = deployConfirmTextBtn;

            document.getElementById("deploy-failure").textContent = "";
            document.getElementById("deploy-success").textContent =
                deploySuccessMsg;

            overlayConfirmationBtn.classList.add("d-none");
            overlayForm.classList.add("d-none");
            overlayConfirmation.classList.add("d-none");
            overlaySuccess.classList.add("d-none");
            overlayFailure.classList.add("d-none");
            overlayBuildFailure.classList.remove("d-none");
            overlayCollapsibleLogButton.classList.add("d-none");

            overlayCollapsibleIconDown.classList.add("d-none");
            overlayCollapsibleIconUp.classList.add("d-none");
            overlayCollapsibleLogContent.classList.add("d-none");
            overlayLoader.classList.add("d-none");
            overlayDeployingInProgress.classList.add("d-none");
            overlayWarningText.classList.add("d-none");

            document.getElementById("build-failure").textContent =
                deployFailedBuildError;
            document
                .getElementById("confirmation-publish")
                .classList.add("d-none");

            document
                .getElementById("overlay-deployment")
                .classList.remove("d-none");
        }
    }

    /**
     * Listeners
     */
    // Polling if the publish button should be active or not;
    // Define the polling function
    function pollServer() {
        // Replace this with your actual API endpoint
        fetch("/cms/ssg/deploy/status")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Could not reach endpoint, returned error-ish response status",
                        {
                            cause: 503,
                        },
                    );
                }
                return response.json();
            })
            .then((data) => {
                if (data.status !== 200 && data.status !== 204) {
                    throw new Error("Not allowed to deploy currently", {
                        cause: data.status,
                    });
                }

                if (data.status === 204) {
                    // currently building, wait ...
                    deployBtn.textContent = deployBtnBuildingText;
                    buildingWrapper.style.display = "flex";

                    deployBtn.disabled = true;
                    publishBtn.disabled = true;
                } else {
                    // done building, ready to be published - allow publish btn again
                    deployBtn.textContent = deployBtnText;
                    buildingWrapper.style.display = "none";

                    deployBtn.disabled = false;
                    publishBtn.disabled = false;
                }
            })
            .catch((errorStatus) => {
                console.error(
                    `The server responded with a 4xx or 5xx code, not allowed to publish, code=${errorStatus}`,
                );
                deployBtn.textContent = deployBtnText;
                buildingWrapper.style.display = "none";

                publishBtn.disabled = true;
                deployBtn.disabled = false;

                if (errorStatus.cause === 500) {
                    showOverlay("error");
                }
            });
    }

    setTimeout(() => {
        pollServer();
    }, 10);

    const pollingInterval = 15000;
    setInterval(pollServer, pollingInterval);

    overlayForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.target.classList.add("d-none");
        overlayLoader.classList.remove("d-none");
        overlayDeployingInProgress.classList.remove("d-none");
        overlayFailure.classList.add("d-none");
        overlayBuildFailure.classList.add("d-none");
        overlayWarningText.classList.add("d-none");
        overlayCollapsibleLogButton.classList.add("d-none");
        overlayCollapsibleIconDown.classList.add("d-none");
        overlayCollapsibleIconUp.classList.add("d-none");
        overlayCollapsibleLogContent.classList.add("d-none");
        const secret = secretDeploymentKeyInput.value;

        cancelingModalIsDisabled = true;

        fetch("/cms/ssg/deploy", {
            method: "post",
            body: JSON.stringify({
                secret,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                overlayLoader.classList.add("d-none");
                overlayDeployingInProgress.classList.add("d-none");

                if (json.status === 401) {
                    throw new Error("Failed to Deploy, No Access Rights.", {
                        cause: deployFailedNoAccessRights,
                    });
                }

                if (json.retval === 0 || json.retval === "0") {
                    overlaySuccess.classList.remove("d-none");
                    overlayCollapsibleLogButton.classList.remove("d-none");
                    overlayCollapsibleIconDown.classList.remove("d-none");
                    overlayCollapsibleIconUp.classList.remove("d-none");
                    overlayCollapsibleLogContent.classList.remove("d-none");

                    overlayCollapsibleLogContent.innerHTML =
                        Array.isArray(json.message) && json.message.length > 0
                            ? generateList(json.message)
                            : json.message;

                    overlayFailure.classList.add("d-none");
                    overlayBuildFailure.classList.add("d-none");
                } else {
                    throw new Error(
                        "Failed to Deploy, Internal Server Error.",
                        {
                            cause: {
                                code: json.retval,
                                log:
                                    Array.isArray(json.message) &&
                                    json.message.length > 0
                                        ? generateList(json.message)
                                        : json.message,
                            },
                        },
                    );
                }
            })
            .catch((e) => {
                console.error(e);

                if (!!e.cause) {
                    if (typeof e.cause === "object") {
                        overlayFailure.innerHTML = getDeployFailedMsgWithCode(
                            e.cause.code,
                        );
                        overlayCollapsibleLogContent.innerHTML = e.cause.log;

                        overlayCollapsibleLogButton.classList.remove("d-none");
                        overlayCollapsibleIconDown.classList.remove("d-none");
                        overlayCollapsibleIconUp.classList.remove("d-none");
                        overlayCollapsibleLogContent.classList.remove("d-none");
                        overlayBuildFailure.classList.add("d-none");
                    } else {
                        overlayFailure.innerHTML = e.cause;
                    }
                }
                overlayFailure.classList.remove("d-none");

                overlayConfirmationBtn.classList.remove("d-none");
                overlayForm.classList.remove("d-none");
                overlayConfirmationBtn.textContent = deployConfirmTextRetryBtn;
            })
            .finally(() => {
                cancelingModalIsDisabled = false;
            });
    });

    const mutationObserver = new MutationObserver(() => {
        if (
            location.pathname.includes("/panel/login") ||
            location.pathname.includes("/panel/installation")
        ) {
            deployBtnWrapper.style.visibility = "hidden";
            versionInfo.style.display = "none";
        } else {
            deployBtnWrapper.style.visibility = "visible";
            versionInfo.style.display = "block";
        }
    });
    mutationObserver.observe(document.body, { subtree: true, childList: true });

    overlayConfirmation
        .querySelector("#close-deployment")
        .addEventListener("click", onClose);

    deployBtn.addEventListener("click", () => showOverlay("deploy"));

    publishBtn.addEventListener("click", () => showOverlay("publish"));

    window.addEventListener("click", (e) => {
        const overlay = document.getElementById("overlay-deployment");
        const overlayIsActive = !overlay.classList.contains("d-none");

        if (overlayIsActive && !cancelingModalIsDisabled) {
            const clickedElement = e.target;
            const innerOverlayWrapper =
                document.getElementById("overlay-wrapper");

            if (clickedElement === overlayConfirmation) {
                onClose();
                return;
            }

            if (
                innerOverlayWrapper.contains(clickedElement) ||
                clickedElement === deployBtn ||
                clickedElement === publishBtn
            ) {
                return;
            } else {
                onClose();
            }
        }
    });

    const firstChildOfBody = document.body.firstChild;
    document.body.insertBefore(deployBtnWrapper, firstChildOfBody);
    document.body.insertBefore(buildingWrapper, firstChildOfBody);
    document.body.insertBefore(overlayConfirmation, firstChildOfBody);
})();

document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const cpPageCard = document.querySelector("[data-template='cp']");

        if (cpPageCard) {
            const observer = new MutationObserver(() => {
                const dialog = cpPageCard.querySelector("dialog");
                if (dialog && location.pathname.endsWith("/cms/panel/site")) {
                    const children = dialog.children;
                    dialog.addEventListener("focusin", (ev) => {
                        const active = document.activeElement;
                        if (active && typeof active.blur === "function") {
                            active.blur();
                            return;
                        }
                    });

                    for (let child of children) {
                        if (child.children?.length > 0) {
                            for (let grandChild of child.children) {
                                const position =
                                    grandChild.querySelector(
                                        '[data-type="sort"]',
                                    );

                                if (!position) {
                                    grandChild.style.opacity =
                                        "var(--opacity-disabled)";
                                    grandChild.style.cursor = "not-allowed";
                                    grandChild.style.pointerEvents = "none";
                                }
                            }
                        }
                    }
                }
            });
            observer.observe(cpPageCard, { childList: true, subtree: true });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
