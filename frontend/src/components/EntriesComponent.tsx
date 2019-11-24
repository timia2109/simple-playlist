import React from "react";
import { AFetchComponent, AFetchStates } from "./AFetchComponent";
import { EntryResult } from "../../../backend/src/api/EntryResult";
import { DefaultComponentProps } from "../DefaultComponentProps";
import API from "../API";
import { ListGroup } from "reactstrap";
import { EntryComponent } from "./EntryComponent";
import { PageSelectorComponent } from "./PageSelectorComponent";
import moment from "moment";
import { Translation } from "react-i18next";
import "../i18n/i18n";


interface EntriesStates extends AFetchStates {
    entriesResult?: EntryResult;
    page: number;
    currentPlayingEntry: SpotifyApi.TrackObjectFull | undefined;
}

export class EntriesComponent extends AFetchComponent<DefaultComponentProps, EntriesStates> {

    constructor(props: DefaultComponentProps) {
        super(props);

        this.state = {
            dataLoaded: false,
            entriesResult: undefined,
            currentPlayingEntry: undefined,
            page: 0
        };

        this.onPlayTrack = this.onPlayTrack.bind(this);
        this.onPageSelect = this.onPageSelect.bind(this);
    }

    private onPlayTrack(entry?: SpotifyApi.TrackObjectFull) {
        this.setState({
            currentPlayingEntry: entry
        });
    }

    private onPageSelect(page: number) {
        this.handleLoadData(this.props.api, page);
    }

    protected async handleLoadData(api: API, page: number = this.state.page): Promise<any> {
        this.setState({
            entriesResult: await api.getTracks(page),
            page,
            dataLoaded: true
        });
    }

    protected renderWithData(): JSX.Element {
        let entriesResult = this.state.entriesResult!;
        return <Translation>
            {(t) => <>
                <h1>Votes</h1>
                <ListGroup>
                    {
                        entriesResult.entries.map(e =>
                            <EntryComponent
                                track={e}
                                key={e.id}
                                currentTrack={this.state.currentPlayingEntry}
                                onPlayRequest={this.onPlayTrack}
                                info={t("lastVote") + moment(e.lastVote).format("DD.MM.YYYY")}
                            />)
                    }
                </ListGroup>
                <PageSelectorComponent
                    currentStart={entriesResult.page * entriesResult.pageSize}
                    elements={entriesResult.pages * entriesResult.pageSize - 1}
                    pageSize={entriesResult.pageSize}
                    onPageChange={this.onPageSelect}
                />
            </>}
        </Translation>;
    }

}