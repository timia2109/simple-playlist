import { DefaultComponentProps } from "../DefaultComponentProps";
import React from "react";
import { FormGroup, Label, Input, InputGroupAddon, Button, InputGroup, ListGroup } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import SpotifyWebApi from "spotify-web-api-node";
import { LoadingComponent } from "./LoadingComponent";
import { EntryComponent } from "./EntryComponent";
import { Translation } from 'react-i18next';
import "../i18n/i18n";

interface SeekStates {
    query: string,
    results: SpotifyApi.TrackObjectFull[],
    loading: boolean,
    currentPlayingEntry: SpotifyApi.TrackObjectFull | undefined;
}

export default class SeekComponent extends React.Component<DefaultComponentProps, SeekStates> {

    private spotifyApi: SpotifyWebApi;

    constructor(props: DefaultComponentProps) {
        super(props);

        this.state = {
            query: "",
            results: [],
            loading: false,
            currentPlayingEntry: undefined
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
        // TODO: Throw Notification
    }

    async onSearchRequest() {
        this.setState({ loading: true });

        let results = await this.spotifyApi.searchTracks(this.state.query, {
            market: "DE"
        });

        this.setState({
            loading: false,
            results: results.body.tracks!.items
        });
    }

    render() {

        return <Translation>
            {
                (t) => <>
                    <h1>Add Track</h1>
                    <InputGroup>
                        <Input
                            type="text"
                            value={this.state.query}
                            onChange={this.onValueChange}
                            placeholder={t("searchQueryPlaceholder")}
                        />
                        <InputGroupAddon addonType="append">
                            <Button color="success" onClick={this.onSearchRequest}>
                                <FontAwesomeIcon icon={faSearch} />
                                Search
                        </Button>
                        </InputGroupAddon>
                    </InputGroup>
                    {
                        this.state.loading &&
                        <LoadingComponent title={t("searchLoad")} />
                    }
                    {
                        !this.state.loading && this.state.results.length > 0 &&
                        <ListGroup>
                            {this.state.results.map(t =>
                                <EntryComponent
                                    currentTrack={this.state.currentPlayingEntry}
                                    track={t}
                                    key={t.id}
                                    onPlayRequest={this.onPlayTrack}
                                >
                                    <Button color="primary" onClick={() => this.onAddClick(t.id)}>
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                        Add
                                </Button>
                                </EntryComponent>
                            )}
                        </ListGroup>
                    }
                </>
            }
        </Translation>;
    }
}