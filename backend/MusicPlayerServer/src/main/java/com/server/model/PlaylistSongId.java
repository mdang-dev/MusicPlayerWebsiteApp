package com.server.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Embeddable
public class PlaylistSongId implements Serializable {

    private String playlistId;
    private int songId;

    @Override
    public boolean equals(Object obj) {
       if(this == obj) return true;
       if(obj == null || getClass() != obj.getClass()) return false;
       PlaylistSongId that = (PlaylistSongId) obj;
       return Objects.equals(playlistId, that.playlistId) && Objects.equals(songId, that.songId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistId, songId);
    }

}
