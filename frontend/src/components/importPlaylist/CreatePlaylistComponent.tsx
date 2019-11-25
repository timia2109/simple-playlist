import { useState } from "react";
import { Form, FormGroup, Input, Label, Button } from "reactstrap";
import React from "react";
import { useTranslation } from "react-i18next";
import { createPlaylist, PlaylistImporterValues } from "../../PlaylistImporterUtils";

export function CreatePlaylistComponent(props: PlaylistImporterValues) {
    const [playlistName, setPlaylistName] = useState("");
    const { t } = useTranslation();

    return <Form>
        <FormGroup>
            <Label>{t("playlistTitle")}</Label>
            <Input 
                value={playlistName}
                type="text"
                onChange={e => setPlaylistName(e.target.value)}
                />
        </FormGroup>
        <Button onClick={()=>createPlaylist(playlistName, props)} color="success">
            {t("startImport")}
        </Button>
    </Form>
} 