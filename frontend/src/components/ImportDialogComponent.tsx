import { DefaultComponentProps } from "../DefaultComponentProps";
import React from "react";
import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, FormGroup, Form, Alert } from "reactstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { Translation } from "react-i18next";
import { LoadingComponent } from "./LoadingComponent";
import { filterPlaylists, ProgressState } from "../PlaylistImporterUtils";
import { CreatePlaylistComponent } from "./importPlaylist/CreatePlaylistComponent";

export interface ImportDialogProps extends DefaultComponentProps {
    isOpen: boolean,
    toggle: () => any
}

interface ImportDialogStates {
    trackIds?: string[]
    userPlaylists?: SpotifyApi.PlaylistObjectSimplified[]
    loading: boolean,
    mode: "Insert" | "Create",
    progressState: ProgressState | undefined
    spotifyApi: SpotifyWebApi
    me?: SpotifyApi.CurrentUsersProfileResponse
}

export default class ImportDialogComponent extends React.Component<ImportDialogProps, ImportDialogStates> {

    constructor(props: ImportDialogProps) {
        super(props);

        const spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(this.props.api.getUserToken()!.access_token);

        this.state = {
            loading: false,
            mode: "Insert",
            progressState: undefined,
            spotifyApi
        };

        this.onModeChange = this.onModeChange.bind(this);
        this.onImportStateChange = this.onImportStateChange.bind(this);
    }

    componentDidUpdate(prevProps: ImportDialogProps) {
        if (this.props.isOpen === true && prevProps.isOpen === false) {
            this.reload();
        }
    }

    private async reload() {
        this.setState({
            loading: true
        });

        let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];

        let offset = 0;
        let lastResult: SpotifyApi.ListOfUsersPlaylistsResponse;
        do {
            lastResult = (await this.state.spotifyApi.getUserPlaylists({
                offset
            })).body;

            userPlaylists = userPlaylists.concat(
                lastResult.items
            );

            offset += lastResult.limit;
        } while (lastResult.offset < lastResult.total);

        const [me, trackIds] = await Promise.all([
            this.state.spotifyApi.getMe(),
            this.props.api.getTrackIds()
        ]);

        userPlaylists = filterPlaylists(userPlaylists, me.body);

        this.setState({
            trackIds,
            userPlaylists,
            loading: false,
            me: me.body,
            progressState: "Nothing"
        });

        console.log({
            trackIds,
            userPlaylists
        });
    }

    onModeChange(mode: "Insert" | "Create") {
        this.setState({ mode });
    }

    onImportStateChange(progressState: ProgressState) {
        this.setState({ progressState });
    }

    renderInsert() {
        return <>Insert</>;
    }

    render() {
        return <Translation>
            {
                t => <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.props.toggle}>
                        {t("importTitle")}
                    </ModalHeader>
                    <ModalBody>
                        {this.state.loading && <LoadingComponent />}
                        {this.state.progressState === "Nothing" && <>
                            <ButtonGroup>
                                <Button onClick={() => this.onModeChange("Insert")} active={this.state.mode === "Insert"} color="primary">
                                    {t("insertToPlaylist")}
                                </Button>
                                <Button onClick={() => this.onModeChange("Create")} active={this.state.mode === "Create"} color="primary">
                                    {t("createPlaylist")}
                                </Button>
                            </ButtonGroup>
                            {this.state.mode === "Create" &&
                                <CreatePlaylistComponent
                                    api={this.state.spotifyApi}
                                    trackIds={this.state.trackIds!}
                                    loadingHandler={this.onImportStateChange}
                                    me={this.state.me!}
                                />}
                            {this.state.mode === "Insert" && <this.renderInsert />}
                        </>}
                        {this.state.progressState === "Pending" &&
                            <LoadingComponent title={t("importPending")} />
                        }
                        {this.state.progressState === "Success" &&
                            <Alert color="success">
                                {t("importSuccess")}
                            </Alert>
                        }
                    </ModalBody>
                </Modal>
            }
        </Translation>;
    }
}