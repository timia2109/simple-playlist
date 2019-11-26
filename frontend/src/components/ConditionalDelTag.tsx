import React from "react";

export interface ConditionalDelProps {
    condition: boolean
    children: JSX.Element
}

export default function ConditionalDelTag(props: ConditionalDelProps) {
    return <>
        {(props.condition && <del>
            {props.children}
        </del>) || props.children}
    </>
}