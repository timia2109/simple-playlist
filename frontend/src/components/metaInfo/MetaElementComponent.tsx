import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import moment from "moment";
import { Tooltip } from "reactstrap";

export interface MetaElementStates {
    i18nTitleId: string;
    value: string | number | Date;
    isDate?: boolean
}

export default function MetaElementComponent(props: MetaElementStates) {
    const { t } = useTranslation();
    const [tooltipOpen, setTooltipOpen] = useState(false);

    let showValue = props.value;
    let tooltip: JSX.Element | undefined = undefined;

    if (props.isDate) {
        const toggle = () => setTooltipOpen(!tooltipOpen);
        const date = moment(showValue);

        showValue = date.format(t("dateFormat"));
        tooltip = <Tooltip placement="top" isOpen={tooltipOpen} target={"elm_"+props.i18nTitleId} toggle={toggle}>
            {date.fromNow()}
        </Tooltip>
    }

    return <tr>
        <th scope="row">{t(props.i18nTitleId)}</th>
        <td id={"elm_" + props.i18nTitleId}>{showValue}</td>
        {tooltip}
    </tr>;
}