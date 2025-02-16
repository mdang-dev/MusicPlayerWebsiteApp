package com.server.dao;

import com.server.model.User;
import com.server.utils.EncryptPasswordUtil;
import com.server.utils.JpaUtilities;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;


public class UserDao implements ISuperDao<User, Integer>{


    EntityManager em = JpaUtilities.getEntityManager();

    @Override
    public void save(User model) {
        try {
            em.getTransaction().begin();
            em.persist(model);
            em.getTransaction().commit();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public void update(User model) {
        try {
            em.getTransaction().begin();
            em.merge(model);
            em.getTransaction().commit();
        }catch (Exception e) {
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public void remove(Integer key) {
        try {
            em.getTransaction().begin();
            em.remove(em.find(User.class, key));
            em.getTransaction().commit();
        }catch (Exception e){
            System.out.println(e.getMessage());
            em.getTransaction().rollback();
        }
    }

    @Override
    public User find(Integer key) {
        return em.find(User.class, key);
    }

    @Override
    public List<User> findAll() {
        TypedQuery<User> query = em.createQuery("SELECT u FROM User u", User.class);
        return query.getResultList();
    }

    public List<User> findUsersAll(){
        TypedQuery<User> query = em.createQuery("SELECT u FROM User u WHERE u.role=:role", User.class)
                .setParameter("role", false);
        return query.getResultList();
    }

    public List<User> findAdminsAll(){
        TypedQuery<User> query = em.createQuery("SELECT u FROM User u WHERE u.role=:role", User.class)
                .setParameter("role", true);
        return query.getResultList();
    }

    public Optional<User> checkUser(String email) {
        em.clear();
        try {
            User user = em.createQuery("SELECT u FROM User u WHERE u.email=:email", User.class)
                            .setParameter("email", email)
                                .getSingleResult();
            return Optional.ofNullable(user);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public User checkValidLogin(Optional<User> user, String password) {
        if(user.isPresent() && EncryptPasswordUtil.isMatchesPassword(password, user.get().getPassword())) {
            return user.get();
        }
        return null;
    }

    public Optional<User> findByUserName(String userName) {
        em.clear();
        try {
            User user = em.createQuery("SELECT u FROM User u WHERE u.userName=:userName", User.class)
                    .setParameter("userName", userName)
                    .getSingleResult();
            return Optional.ofNullable(user);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public static void main(String[] args) {
        System.out.println(new UserDao().checkUser("danglmpc09116@gmail.com").isPresent());
    }

}
