import { DefaultComponentProps } from "../DefaultComponentProps";
import React from "react";
import { Input, InputGroupAddon, Button, InputGroup, ListGroup, Card, CardHeader, CardBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlusCircle, faCheck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import SpotifyWebApi from "spotify-web-api-node";
import { LoadingComponent } from "./LoadingComponent";
import { EntryComponent } from "./EntryComponent";
import { Translation } from 'react-i18next';
import "../i18n/i18n";
import { PageSelectorComponent } from "./PageSelectorComponent";

const SEARCH_LIMIT = 20;

interface SeekStates {
    query: string,
    results: SpotifyApi.TrackObjectFull[],
    loading: boolean,
    currentPlayingEntry: SpotifyApi.TrackObjectFull | undefined;
    page: number,
    searchResults: number,
    alreadyVoted: Set<string>
}

export default class SeekComponent extends React.Component<DefaultComponentProps, SeekStates> {

    private spotifyApi: SpotifyWebApi;

    constructor(props: DefaultComponentProps) {
        super(props);

        this.state = {
            query: "",
            results: [],
            loading: false,
            currentPlayingEntry: undefined,
            page: 0,
            searchResults: 0,
            alreadyVoted: new Set()
        };

        this.onValueChange = this.onValueChange.bind(this);
        this.onSearchRequest = this.onSearchRequest.bind(this);
        this.onPlayTrack = this.onPlayTrack.bind(this);

        this.spotifyApi = new SpotifyWebApi({});
        this.spotifyApi.setAccessToken(this.props.spotifyToken.access_token);
    }

    componentDidUpdate() {
        this.spotifyApi.setAccessToken(this.props.spotifyToken.access_token);
    }

    onPlayTrack(entry?: SpotifyApi.TrackObjectFull) {
        this.setState({
            currentPlayingEntry: entry
        });
    }

    onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let target = event.target;
        let value = target.value;

        this.setState({
            query: value,
            loading: false,
            results: []
        });
    }

    async onAddClick(trackId: string) {
        await this.props.api.submitTrack(trackId);

        this.state.alreadyVoted.add(trackId);
        this.setState(() => {
            return {
                alreadyVoted: this.state.alreadyVoted
            }
        });
        this.props.api.notifyEntriesChange();
    }

    async onSearchRequest(page: number = 0) {
        this.setState({ loading: true });

        let results = await this.spotifyApi.searchTracks(this.state.query, {
            market: "DE",
            limit: SEARCH_LIMIT,
            offset: page
        });

        let tracks = results.body.tracks!;

        this.setState({
            loading: false,
            results: tracks.items,
            page,
            searchResults: tracks.total
        });
    }

    render() {

        return <Translation>
            {
                (t) =>
                    <Card className="mb-3">
                        <CardHeader tag="h3">
                            {t("addTracks")}
                        </CardHeader>
                        <CardBody>
                            <InputGroup className="mb-3">
                                <Input
                                    type="text"
                                    value={this.state.query}
                                    onChange={this.onValueChange}
                                    placeholder={t("searchQueryPlaceholder")}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button color="success" onClick={() => this.onSearchRequest()}>
                                        <FontAwesomeIcon icon={faSearch} />
                                        {t("search")}
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                            {
                                this.state.loading &&
                                <LoadingComponent title={t("searchLoad")} />
                            }
                            {
                                !this.state.loading && this.state.results.length > 0 &&
                                <>
                                    <PageSelectorComponent
                                        currentStart={this.state.page}
                                        elements={this.state.searchResults}
                                        onPageChange={this.onSearchRequest}
                                        pageSize={SEARCH_LIMIT}
                                    />
                                    <ListGroup>
                                        {this.state.results.map(e =>
                                            <EntryComponent
                                                currentTrack={this.state.currentPlayingEntry}
                                                track={e}
                                                key={e.id}
                                                onPlayRequest={this.onPlayTrack}
                                            >
                                                {this.state.alreadyVoted.has(e.id) &&
                                                    <Button color="primary" disabled>
                                                        <FontAwesomeIcon icon={faCheckCircle} />
                                                        {t("added")}
                                                    </Button>
                                                }
                                                {
                                                    !this.state.alreadyVoted.has(e.id) && <Button color="primary" onClick={() => this.onAddClick(e.id)}>
                                                        <FontAwesomeIcon icon={faPlusCircle} />
                                                        {t("add")}
                                                    </Button>
                                                }

                                            </EntryComponent>
                                        )}
                                    </ListGroup>
                                    <PageSelectorComponent
                                        currentStart={this.state.page}
                                        elements={this.state.searchResults}
                                        onPageChange={this.onSearchRequest}
                                        pageSize={SEARCH_LIMIT}
                                    />
                                </>
                            }
                        </CardBody>
                    </Card>
            }
        </Translation>;
    }
}