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
import IEntriesChangeListener from "../IEntriesChangeListener";
import ImportPlaylistComponent from "./ImportPlaylistComponent";


interface EntriesStates extends AFetchStates {
    entriesResult?: EntryResult,
    currentPlayingEntry: SpotifyApi.TrackObjectFull | undefined
}

export class EntriesComponent extends AFetchComponent<DefaultComponentProps, EntriesStates> implements IEntriesChangeListener {

    constructor(props: DefaultComponentProps) {
        super(props);

        this.state = {
            dataLoaded: false,
            entriesResult: undefined,
            currentPlayingEntry: undefined
        };

        this.onPlayTrack = this.onPlayTrack.bind(this);
        this.onPageSelect = this.onPageSelect.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.api.attach(this);
    }

    componentWillUnmount() {
        this.props.api.detach(this);
    }

    private onPlayTrack(entry?: SpotifyApi.TrackObjectFull) {
        this.setState({
            currentPlayingEntry: entry
        });
    }

    private onPageSelect(page: number) {
        this.handleLoadData(this.props.api, page);
    }

    protected async handleLoadData(api: API, page: number = 0): Promise<any> {
        this.setState({
            entriesResult: await api.getTracks(page),
            dataLoaded: true
        });
    }

    reloadEntries() {
        // Always set Page to 0 on add
        this.handleLoadData(this.props.api, 0);
    }

    protected renderWithData(): JSX.Element {
        let entriesResult = this.state.entriesResult!;
        return <Translation>
            {(t) => <>
                <h1>{t("votes")}</h1>
                <PageSelectorComponent
                    currentStart={entriesResult.offset}
                    elements={entriesResult.items}
                    pageSize={entriesResult.size}
                    onPageChange={this.onPageSelect}
                />
                <ImportPlaylistComponent {...this.props} />
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
                    currentStart={entriesResult.offset}
                    elements={entriesResult.items}
                    pageSize={entriesResult.size}
                    onPageChange={this.onPageSelect}
                />
            </>}
        </Translation>;
    }

}