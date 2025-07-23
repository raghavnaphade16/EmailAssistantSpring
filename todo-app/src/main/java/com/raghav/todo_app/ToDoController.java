package com.raghav.todo_app;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todo")
@CrossOrigin(origins = "*")
public class ToDoController {
    private final TodoService todoService;


    public ToDoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/getAllTodos")
    public List<TodoModel> getAllTodos(){
        return todoService.getAllTodos();
    }
    @PostMapping("/createTodo")
    public TodoModel createTodo(@RequestBody TodoModel todoModel) {
        return todoService.saveTodo(todoModel);
    }
    @DeleteMapping("/deleteTodo/{id}")
    public boolean createTodo(@PathVariable Long id) {
        return todoService.deleteTodo(id);
    }

    @PutMapping("/updateTodo/{id}")
    public TodoModel updateTodo(@PathVariable Long id,@RequestBody TodoModel todoModel) {
        return todoService.updateTodo(id,todoModel);
    }
    @GetMapping("/searchTodo/{searchText}")
    public List<TodoModel> searchAllTodo(@PathVariable String searchText){
        return todoService.searchTodo(searchText);
    }
    @GetMapping("/user/{userName}")
    public UserModel getUserByName(@PathVariable String userName) {
        return todoService.getUserDetails(userName); // internally uses stream
    }
}
