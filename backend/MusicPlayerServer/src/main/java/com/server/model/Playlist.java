package com.server.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.codehaus.jackson.annotate.JsonManagedReference;
import org.hibernate.annotations.GenericGenerator;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RequiredArgsConstructor

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "Playlists")
public class Playlist {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "Playlist_ID")
    private String playlistId;

    @ManyToOne
    @JoinColumn(name = "User_ID", nullable = false)
    @JsonIgnore
    @NonNull
    private User user;

    @Column(name = "Playlist_Name", columnDefinition = "NVARCHAR(255)", nullable = false)
    @NonNull
    private String playlistName;

    @OneToMany(mappedBy = "playlist")
    private List<Playlist_Song> playlistSongs;
}
