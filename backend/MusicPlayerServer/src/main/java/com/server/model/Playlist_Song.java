package com.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "Playlists_Songs")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Playlist_Song {

    @EmbeddedId
    @JsonIgnore
    private PlaylistSongId id;

    @ManyToOne
    @MapsId("playlistId")
    @JoinColumn(name = "Playlist_ID", nullable = false)
    @JsonIgnore
    private Playlist playlist;

    @ManyToOne
    @MapsId("songId")
    @JoinColumn(name = "Song_ID", nullable = false)
    private Song song;

    @Column(name = "Position_In_Playlist", nullable = false)
    private int positionInPlaylist;

}
