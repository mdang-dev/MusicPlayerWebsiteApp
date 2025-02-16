package com.server.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.codehaus.jackson.annotate.JsonManagedReference;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RequiredArgsConstructor


@Entity
@Table(name = "Users")
public class User {

    @Id
    @Column(name = "User_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NonNull
    private int userId;

    @Column(name = "User_Name", nullable = false)
    @NonNull
    private String userName;

    @Column(name = "Name", columnDefinition = "NVARCHAR(255)", nullable = false)
    @NonNull
    private String name;

    @Column(name = "Email", nullable = false)
    @NonNull
    private String email;

    @Column(name = "Password", nullable = false)
    @NonNull
    private String password;

    @Column(name = "Avatar")
    @NonNull
    private String avatar;

    @Column(name = "Role", nullable = false)
    @NonNull
    private boolean role;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Playlist> playlists;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Liked_Song> likedSongs;

}
