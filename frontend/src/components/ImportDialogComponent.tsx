import { DefaultComponentProps } from "../DefaultComponentProps";
import React from "react";
import { Modal, ModalHeader, ModalBody, ButtonGroup, Button, FormGroup, Form, Alert } from "reactstrap";
import SpotifyWebApi from "spotify-web-api-node";
import { Translation } from "react-i18next";
import { LoadingComponent } from "./LoadingComponent";
import { CreatePlaylistComponent } from "./importPlaylist/CreatePlaylistComponent";
import { InsertPlaylistComponent } from "./importPlaylist/InsertPlaylistComponent";
import { SpotifyUtils, ProgressState } from "../logic/SpotifyUtils";

export interface ImportDialogProps extends DefaultComponentProps {
    isOpen: boolean,
    toggle: () => any
}

interface ImportDialogStates {
    userPlaylists?: SpotifyApi.PlaylistObjectSimplified[]
    loading: boolean,
    mode: "Insert" | "Create",
    progressState: ProgressState | undefined
    spotifyUtils: SpotifyUtils;
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
            spotifyUtils: new SpotifyUtils(spotifyApi)
        };

        this.onModeChange = this.onModeChange.bind(this);
        this.onImportStateChange = this.onImportStateChange.bind(this);
        this.state.spotifyUtils.bindLoadingHandler(this.onImportStateChange);
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

        const [trackIds, userPlaylists] = await Promise.all([
            this.props.api.getTrackIds(),
            this.state.spotifyUtils.getPlaylists(),
            this.state.spotifyUtils.loadMe(),
        ]);

        this.state.spotifyUtils.bindTrackUris(trackIds);

        this.setState({
            userPlaylists,
            loading: false,
            progressState: "Nothing"
        });
    }

    onModeChange(mode: "Insert" | "Create") {
        this.setState({ mode });
    }

    onImportStateChange(progressState: ProgressState) {
        this.setState({ progressState });
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
                            <ButtonGroup className="mb-3">
                                <Button onClick={() => this.onModeChange("Insert")} active={this.state.mode === "Insert"} color="primary">
                                    {t("insertToPlaylist")}
                                </Button>
                                <Button onClick={() => this.onModeChange("Create")} active={this.state.mode === "Create"} color="primary">
                                    {t("createPlaylist")}
                                </Button>
                            </ButtonGroup>
                            {this.state.mode === "Create" &&
                                <CreatePlaylistComponent
                                    spotifyUtils={this.state.spotifyUtils}
                                />}
                            {this.state.mode === "Insert" && <InsertPlaylistComponent
                                spotifyUtils={this.state.spotifyUtils}
                                playlists={this.state.userPlaylists!}
                            />}
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