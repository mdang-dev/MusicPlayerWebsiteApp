package com.server.utils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Persistence;

public class JpaUtilities {

    public static EntityManager getEntityManager () {
        return Persistence.createEntityManagerFactory("JPA").createEntityManager();
    }

}
