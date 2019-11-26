import React from "react";
import { AFetchComponent, AFetchStates } from "./AFetchComponent";
import { EntryResult } from "../../../backend/src/api/EntryResult";
import { DefaultComponentProps } from "../DefaultComponentProps";
import API from "../API";
import { ListGroup, Badge, ButtonGroup, Button, CardHeader, CardBody, Card } from "reactstrap";
import { EntryComponent } from "./EntryComponent";
import { PageSelectorComponent } from "./PageSelectorComponent";
import moment from "moment";
import { Translation } from "react-i18next";
import "../i18n/i18n";
import IEntriesChangeListener from "../IEntriesChangeListener";
import ImportPlaylistComponent from "./ImportPlaylistComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync";
import { faTrash, faTrashRestore } from "@fortawesome/free-solid-svg-icons";
import ConditionalDelTag from "./ConditionalDelTag";


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
            {(t) =>
                <Card>
                    <CardHeader tag="h3">
                        {t("votes")}
                        <Badge
                            hidden={this.state.entriesResult === undefined}
                            color="primary"
                            className="ml-3"
                        >
                            {entriesResult.items}
                        </Badge>
                    </CardHeader>
                    <CardBody>
                        <ButtonGroup className="mb-3">
                            <ImportPlaylistComponent {...this.props} />
                            <Button color="secondary" onClick={this.refresh.bind(this)}>
                                <FontAwesomeIcon icon={faSync} />
                                {t("reload")}
                            </Button>
                        </ButtonGroup>
                        <PageSelectorComponent
                            currentStart={entriesResult.offset}
                            elements={entriesResult.items}
                            pageSize={entriesResult.size}
                            onPageChange={this.onPageSelect}
                        />
                        <ListGroup>
                            {
                                entriesResult.entries.map(e =>
                                    <ConditionalDelTag
                                        condition={this.props.api.info.isAdmin && e.banned!}
                                        key={e.id}
                                    >
                                        <EntryComponent
                                            track={e}
                                            currentTrack={this.state.currentPlayingEntry}
                                            onPlayRequest={this.onPlayTrack}
                                            info={t("lastVote") + moment(e.lastVote).format("DD.MM.YYYY")}
                                        >
                                            {this.props.api.info.isAdmin && e.banned !== true &&
                                                <Button color="danger" onClick={() => this.props.api.deleteTrack(e.id)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            }
                                            {this.props.api.info.isAdmin && e.banned === true &&
                                                <Button color="warning" onClick={() => this.props.api.undeleteTrack(e.id)}>
                                                    <FontAwesomeIcon icon={faTrashRestore} />
                                                </Button>
                                            }
                                        </EntryComponent>
                                    </ConditionalDelTag>)
                            }
                        </ListGroup>
                        <PageSelectorComponent
                            currentStart={entriesResult.offset}
                            elements={entriesResult.items}
                            pageSize={entriesResult.size}
                            onPageChange={this.onPageSelect}
                        />
                    </CardBody>
                </Card>
            }
        </Translation>;
    }

}