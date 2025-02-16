package com.server.mapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PlaylistMapper {

    private String playlistId;
    private int userId;
    private String playlistName;

}
