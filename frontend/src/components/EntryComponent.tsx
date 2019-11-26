import React, { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faUser } from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons/faSpotify";
import { TrackPlayRequestHandler, PlayTrackComponent } from "./PlayTrackComponent";
import { ButtonGroup, Badge, ListGroupItem } from "reactstrap";
import { useTranslation } from 'react-i18next';
import "../i18n/i18n";


export interface EntryProps {
    track: SpotifyApi.TrackObjectFull;
    onPlayRequest?: TrackPlayRequestHandler;
    currentTrack?: SpotifyApi.TrackObjectFull;
    info?: string[]
}

export function EntryComponent(props: React.PropsWithChildren<EntryProps>) {

    const { t } = useTranslation();

    let imageStyle: CSSProperties = {
        marginRight: "5px"
    };

    const track = props.track;
    const artists = track.artists
        .map(a => a.name)
        .join(", ");

    return (
        <ListGroupItem>
            <div className="media">
                <img src={track.album.images[2].url} width="64" height="64" style={imageStyle} alt="Cover" />
                <div className="media-body">
                    <div className="d-flex w-100 h-100 justify-content-between">
                        <h5 className="mt-0 mb-1">
                            <FontAwesomeIcon icon={faMusic} />
                            {track.name}
                        </h5>
                    </div>

                    <div>
                        <FontAwesomeIcon icon={faUser} />
                        {artists}
                    </div>
                </div>
            </div>
            <div>
                {props.info && props.info.map((t, i) => <Badge pill key={i} className="mr-1">
                    {t}
                </Badge>
                )}
            </div>

            <ButtonGroup>
                {props.children}
                {props.onPlayRequest !== undefined && track.preview_url && <PlayTrackComponent track={track} onPlayRequest={props.onPlayRequest} playing={props.currentTrack !== undefined && props.currentTrack.id === props.track.id} />}
                <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <FontAwesomeIcon icon={faSpotify} />
                    {t("playOnSpotify")}
                </a>
            </ButtonGroup>
        </ListGroupItem>
    );
}