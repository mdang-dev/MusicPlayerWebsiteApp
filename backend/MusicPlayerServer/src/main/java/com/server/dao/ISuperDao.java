package com.server.dao;

import java.util.List;

abstract public interface ISuperDao<M, K> {

    public void save(M model);
    public void update(M model);
    public void remove(K key);
    public M find(K key);
    public List<M> findAll();

}
