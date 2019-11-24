import { Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync";
import React from "react";

export interface LoadingProps {
    title? : string;
}

export function LoadingComponent(props: LoadingProps) {
    let title = props.title || "Lade Daten bitte warten...";

    return <Alert color="primary">
        <FontAwesomeIcon icon={faSync} spin />
        {title}
    </Alert>;
}