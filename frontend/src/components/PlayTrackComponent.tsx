import React from "react";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { Translation } from 'react-i18next';
import "../i18n/i18n";

export type TrackPlayRequestHandler = (track?: SpotifyApi.TrackObjectFull) => any;

export interface PlayTrackProps {
    track: SpotifyApi.TrackObjectFull;
    playing: boolean;
    onPlayRequest: TrackPlayRequestHandler;
}

export class PlayTrackComponent extends React.Component<PlayTrackProps> {

    private audio?: HTMLAudioElement;

    componentDidUpdate(prevProps: PlayTrackProps) {
        if (this.props.playing && !prevProps.playing) {
            this.play();
        }
        else if (this.audio !== undefined && prevProps.playing && !this.props.playing) {
            this.audio.pause();
            this.audio.remove();
            this.audio = undefined;
        }
    }

    componentWillUnmount() {
        if (this.audio) {
            this.audio.pause();
            this.audio.remove();
        }
    }

    private play(): void {
        this.audio = new Audio(this.props.track.preview_url);
        this.audio.addEventListener("ended", () => this.props.onPlayRequest(undefined));
        this.audio.play();
    }

    private onClick() {
        if (this.props.playing)
            this.props.onPlayRequest(undefined);
        else
            this.props.onPlayRequest(this.props.track);
    }

    render() {

        return <Translation>
            {
                (t) => <Button color="success" active={this.props.playing} onClick={this.onClick.bind(this)}>
                    <FontAwesomeIcon icon={faPlayCircle} />
                    {!this.props.playing && t("play")}
                    {this.props.playing && t("stop")}
                </Button>
            }
        </Translation>
    }
}