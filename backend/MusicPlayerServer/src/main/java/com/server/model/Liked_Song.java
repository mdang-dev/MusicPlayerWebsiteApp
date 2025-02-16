package com.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "Liked_Songs")
public class Liked_Song {

    @EmbeddedId
    @JsonIgnore
    private LikedSongId id;

    @MapsId("userId")
    @ManyToOne
    @JoinColumn(name = "User_ID", nullable = false)
    @JsonIgnore
    private User user;

    @MapsId("songId")
    @ManyToOne
    @JoinColumn(name = "Song_ID", nullable = false)
    private Song song;

    @Column(name = "positionInListLiked")
    private int positionInListLiked;

}
