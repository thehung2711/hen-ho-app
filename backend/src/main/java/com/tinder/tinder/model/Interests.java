package com.tinder.tinder.model;

import jakarta.persistence.*;

@Table
@Entity(name = "interests")
public class Interests {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    public Interests(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Interests(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Interests() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
}
