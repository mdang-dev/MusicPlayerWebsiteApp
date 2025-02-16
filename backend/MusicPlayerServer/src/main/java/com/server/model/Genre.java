package com.server.model;

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
@Table(name = "Genres")
public class Genre {

    @Id
    @Column(name = "Genre_ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int genreId;

    @Column(name = "Genre_Name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String genreName;

}
