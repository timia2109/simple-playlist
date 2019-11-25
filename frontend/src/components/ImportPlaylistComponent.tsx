import { Button } from "reactstrap";
import React, { useState } from "react";
import { DefaultComponentProps } from "../DefaultComponentProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons/faSpotify";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";
import ImportDialogComponent from "./ImportDialogComponent";

export default function ImportPlaylistComponent(props: DefaultComponentProps) {
    const { t } = useTranslation();
    const [isModalOpen, setModalOpen] = useState(false);

    const hasUserAccessToken = props.api.getUserToken() !== undefined;

    if (hasUserAccessToken) {
        return <>
            <Button color="success" onClick={() => setModalOpen(true)} hidden={isModalOpen} className="mb-3">
                <FontAwesomeIcon icon={faSpotify} />
                {t("import")}
            </Button>
            <ImportDialogComponent isOpen={isModalOpen} toggle={() => setModalOpen(!isModalOpen)} {...props} />
        </>
    }
    else {
        return <Button color="success" tag="a" href={props.api.getLoginUrl()}>
            <FontAwesomeIcon icon={faSpotify} />
            {t("login")}
        </Button>
    }
}