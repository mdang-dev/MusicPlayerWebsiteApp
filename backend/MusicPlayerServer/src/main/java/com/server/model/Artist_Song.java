package com.server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RequiredArgsConstructor

@Entity
@Table(name = "Artists_Songs")
public class Artist_Song {

    @EmbeddedId
    private ArtistSongId id;

    @ManyToOne
    @MapsId("artistId")
    @JoinColumn(name = "Artist_ID", nullable = false)
    @NonNull
    private Artist artist;

    @ManyToOne
    @MapsId("songId")
    @JoinColumn(name = "Song_ID", nullable = false)
    @NonNull
    @JsonIgnore
    private Song song;


}
