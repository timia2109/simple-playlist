import { Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync";
import React from "react";
import { useTranslation } from "react-i18next";

export interface LoadingProps {
    title? : string;
}

export function LoadingComponent(props: LoadingProps) {
    const {t} = useTranslation();
    let title = props.title || t("loading");

    return <Alert color="primary">
        <FontAwesomeIcon icon={faSync} spin />
        {title}
    </Alert>;
}