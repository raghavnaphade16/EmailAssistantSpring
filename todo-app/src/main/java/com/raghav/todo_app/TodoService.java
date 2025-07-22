package com.raghav.todo_app;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {
    private final RestTemplate restTemplate;
    private final TodoRepository todoRepository;

    public TodoService(RestTemplate restTemplate, TodoRepository todoRepository) {
        this.restTemplate = restTemplate;
        this.todoRepository = todoRepository;
    }

    public List<TodoModel> getAllTodos(){
        return todoRepository.findAll();
    }
    public TodoModel saveTodo(TodoModel todoModel) {
        return todoRepository.save(todoModel);
    }
    public boolean deleteTodo(Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public TodoModel updateTodo(Long id,TodoModel todoModel) {
       return  todoRepository.findById(id).map(existingTodo -> {
           existingTodo.setTitle(todoModel.getTitle());
           existingTodo.setCompleted(todoModel.isCompleted());
           return todoRepository.save(existingTodo);
       }).orElse(null);
    }

    public  List<TodoModel> searchTodo(String searchText){
        String search = searchText.toLowerCase();
        List<TodoModel> list = todoRepository.findAll().stream().filter(todo -> todo.getTitle().toLowerCase().contains(search)).collect((Collectors.toList()));
        return  list;
    }

    public UserModel getUserDetails(String userName) {
        try {
            String url = "http://localhost:8081/api/user/getUser/" + userName;
            return restTemplate.getForObject(url, UserModel.class);
        } catch (Exception e) {
            System.out.println(e);
            throw new RuntimeException(e);
        }

    }
}
