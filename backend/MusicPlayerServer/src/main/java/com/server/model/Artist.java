package com.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

@Entity
@Table(name = "Artists")
public class Artist {

    @Id
    @Column(name = "Artist_ID", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int artistId;

    @Column(name = "Artist_Name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String artistName;

    @Column(name = "Gender", nullable = false)
    private boolean gender;

    @Column(name = "More_Info", nullable = true)
    private String moreInfo;

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Artist_Song> artistSongs ;

}
