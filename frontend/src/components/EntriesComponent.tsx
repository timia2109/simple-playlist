import React from "react";
import { AFetchComponent, AFetchStates } from "./AFetchComponent";
import { EntryResult } from "../../../backend/src/api/EntryResult";
import { DefaultComponentProps } from "../DefaultComponentProps";
import API from "../API";
import { ListGroup, Badge, ButtonGroup, Button, CardHeader, CardBody, Card, Table } from "reactstrap";
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
import MetaInfo from "../../../backend/src/database/MetaInfo";
import MetaElementComponent from "./metaInfo/MetaElementComponent";
import { humanizeMs } from "../logic/MetaUtils";


interface EntriesStates extends AFetchStates {
    entriesResult?: EntryResult,
    currentPlayingEntry: SpotifyApi.TrackObjectFull | undefined,
    metaInfo?: MetaInfo;
}

export class EntriesComponent extends AFetchComponent<DefaultComponentProps, EntriesStates> implements IEntriesChangeListener {

    autoLoad = true;

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

    private onPlayTrack(entry?: SpotifyApi.TrackObjectFull) {
        this.setState({
            currentPlayingEntry: entry
        });
    }

    private onPageSelect(page: number) {
        this.handleLoadData(this.props.api, page);
    }

    protected async handleLoadData(api: API, page: number = 0): Promise<any> {
        const [entriesResult, metaInfo] = await Promise.all([
            api.getTracks(page),
            api.getMetaInfo()
        ]);

        this.setState({
            entriesResult,
            metaInfo,
            dataLoaded: true
        });
    }

    reload() {
        // Always set Page to 0 on add
        this.handleLoadData(this.props.api, 0);
    }

    protected renderWithData(): JSX.Element {
        const entriesResult = this.state.entriesResult!;
        const meta = this.state.metaInfo!;
        const totalLength = humanizeMs(meta.trackLengthMs);

        return <Translation>
            {(t) =>
                <>
                    <Card className="mb-3">
                        <CardHeader tag="h3">
                            {t("votes")}
                            <Badge
                                hidden={this.state.entriesResult === undefined}
                                color="primary"
                                className="ml-3"
                            >
                                {entriesResult.items}
                            </Badge>
                            <Badge
                                hidden={this.state.entriesResult === undefined}
                                color="info"
                                className="ml-3">
                                {totalLength}
                            </Badge>
                        </CardHeader>
                        <CardBody>
                            <ButtonGroup className="mb-3">
                                <ImportPlaylistComponent {...this.props} />
                                <Button color="secondary" onClick={() => this.props.api.notifyEntriesChange()}>
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
                                                info={[
                                                    t("lastVote", { date: moment(e.lastVote).format(t("dateFormat")) }),
                                                    t("nVotes", { votes: e.votes.length.toString() })
                                                ]}
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
                    <Table size="sm" striped className="mb-3">
                        <tbody>
                            <MetaElementComponent i18nTitleId="firstVoteMeta" value={meta.firstVote} isDate />
                            <MetaElementComponent i18nTitleId="lastVoteMeta" value={meta.lastVote} isDate />
                            <MetaElementComponent i18nTitleId="totalLengthMeta" value={totalLength} />
                        </tbody>
                    </Table>
                </>
            }
        </Translation>;
    }

}