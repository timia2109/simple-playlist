import { Pagination, PaginationLink, PaginationItem } from "reactstrap";
import React from "react";

export interface PageSelectorProps {
    currentStart: number,
    elements: number,
    pageSize: number,
    onPageChange: (index: number) => any,
}

export function PageSelectorComponent(props: PageSelectorProps): JSX.Element {
    let items = getPageItems(props);

    return <Pagination>
        <PaginationItem disabled={props.currentStart < props.pageSize}>
            <PaginationLink first onClick={() => props.onPageChange(0)} />
        </PaginationItem>
        <PaginationItem disabled={props.currentStart - props.pageSize < 0}>
            <PaginationLink previous onClick={() => props.onPageChange(props.currentStart - props.pageSize)} />
        </PaginationItem>

        {items.map(pi => <PaginationItem key={pi.label} active={props.currentStart === pi.startIndex}>
            <PaginationLink onClick={() => props.onPageChange(pi.startIndex)}>
                {pi.label}
            </PaginationLink>
        </PaginationItem>)}

        <PaginationItem disabled={props.currentStart + props.pageSize > props.elements}>
            <PaginationLink next onClick={() => props.onPageChange(props.currentStart + props.pageSize)} />
        </PaginationItem>

    </Pagination>;
}

type PageItem = {
    label: string,
    startIndex: number
}

function getPageItems(props: PageSelectorProps): PageItem[] {
    let items: PageItem[] = [];

    let showPages = window.innerWidth < 768 ? 5 : 11 ;

    let labelIndex = Math.max(0, Math.floor(props.currentStart / props.pageSize) - 5);
    let itemsIndex = labelIndex * props.pageSize;

    while (items.length < showPages && itemsIndex <= props.elements) {
        items.push({
            label: (labelIndex + 1).toString(),
            startIndex: itemsIndex
        });

        labelIndex++;
        itemsIndex += props.pageSize;
    }

    return items;
}