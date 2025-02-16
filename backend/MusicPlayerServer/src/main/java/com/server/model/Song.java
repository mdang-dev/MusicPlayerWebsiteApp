package com.server.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.net.Proxy;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "Songs")
public class Song {

    @Id
    @Column(name = "Song_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int songId;

    @Column(name = "Song_Name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String songName;

    @Column(name = "Duration")
    private int duration;

    @ManyToOne
    @JoinColumn(name = "Genre_ID", nullable = false)
    private Genre genre;

    @Column(name = "Release_Date", columnDefinition = "DATE")
    private Date releaseDate;

    @Column(name = "Cover_Photo", nullable = false)
    private String coverPhoto;

    @Column(name = "File_Path", nullable = false)
    private String filePath;

    @Column(name = "Plays")
    private int plays;

    @OneToMany(mappedBy = "song", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Artist_Song> artistSongs;

    @Override
    public String toString() {
        return "Song{" +
                "plays=" + plays +
                ", filePath='" + filePath + '\'' +
                ", coverPhoto='" + coverPhoto + '\'' +
                ", releaseDate=" + releaseDate +
                ", genre=" + genre +
                ", duration=" + duration +
                ", songName='" + songName + '\'' +
                ", songId=" + songId +
                '}';
    }
}
