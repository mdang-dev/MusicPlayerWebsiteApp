package com.server.mapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class SongMapper {

    private int songId;

    private String songName;

    private int duration;

    private int genre;

    private Date releaseDate;

    private int[] artists;

}
