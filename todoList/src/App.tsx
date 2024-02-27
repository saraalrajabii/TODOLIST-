import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,

  Typography,
} from "@material-ui/core";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import icon from "../public/image/icon.png";
import { useStore } from "./todoStore";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CachedIcon from "@mui/icons-material/Cached";
import { z, ZodType } from "zod";

const useStyles = makeStyles((theme) => ({
  headerTextStyles: {
    textAlign: "center",
    marginBottom: theme.spacing(3),
  },
  textBoxStyles: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    width: "70%",
    background: "black",
    borderRadius: "12px",
  },
  textEditBoxStyles: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    width: "70%",
    background: "white",
    borderRadius: "12px",
  },
  addButtonStyles: {
    margin: theme.spacing(0.5),
    borderRadius: "12px",
    borderColor: "#ffff",
    borderStyle: "solid",
  },
  addButtonEditStyles: {
    margin: theme.spacing(0.1),
    borderRadius: "12px",
    background: "red",
    borderStyle: "solid",
  },
  completedTodoStyles: {
    textDecoration: "line-through",
  },
}));

export type FormData = {
  todoText: string;
};

function App() {
  const {
    textBoxStyles,
    addButtonStyles,
    textEditBoxStyles,
    addButtonEditStyles,
    completedTodoStyles,
  } = useStyles();
  // const [todoText, setTodoText] = useState("");
  const [todoUpdatedText, setTodoUpdatedText] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null); // Change to string | null

  const { addTodo, removeTodo, updateToDo, toggleCompletedState, todos } =
    useStore();

  const handleToggleCompletedState = (id: string) => {
    toggleCompletedState(id);
    toast.success(" Todo status updated Successfully!");
  };

  const ValidationSchema: ZodType<FormData> = z.object({
    todoText: z.string().min(3).max(20),
  });

  type ValidationSchema = z.infer<typeof ValidationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(ValidationSchema),
  });

  const submitData: SubmitHandler<FormData> = (data) => {
    if (data.todoText.trim()) {
      addTodo(data.todoText);
      reset();
      console.log("iside");
      toast.success(" Todo added Successfully!");
    } else {
      toast.error("Todo field  cannot be empty!");
    }
  };
  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit(submitData)}>
        <input
          className={textBoxStyles}
          placeholder="Start typing"
          required
          {...register("todoText")} // <-- Register the input with react-hook-form
          // onChange={(e) => setTodoText(e.target.value)}
        />

        <Button
          type="submit"
          className={addButtonStyles}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        {errors.todoText && (
          <span className="red">{errors.todoText.message}</span>
        )}

        <Toaster position="bottom-center" reverseOrder={false} />

        <List>
          {todos.length === 0 && (
            <div className="empty-list-container">
              <img src={icon} alt="alt" className="empty-image " />
              <Typography className="empty-text">
                you have nothing to do{" "}
              </Typography>
            </div>
          )}

          {todos.map((todo) => (
            <ListItem className="ListItem-container" key={todo.id}>
              <>
                {isEditing === todo.id ? (
                  <>
                    <input
                      className={textEditBoxStyles}
                      value={todoUpdatedText}
                      onChange={(e) => setTodoUpdatedText(e.target.value)} // Changed from e.eventPhase.value to e.target.value
                    />
                    <Button
                      className={addButtonEditStyles}
                      variant="contained"
                      onClick={() => {
                        updateToDo(todo.id, todoUpdatedText);
                        toast.success(" Todo status updated Successfully!");
                        setIsEditing(null);
                      }}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <>
                    <ListItemText
                      className={todo.completed ? completedTodoStyles : ""}
                      key={todo.id}
                    >
                      {todo.description}
                    </ListItemText>

                    <ListItemIcon>
                      {todo.completed ? (
                        <>
                          <TaskAltIcon
                            style={{
                              color: "#8d8989",
                              width: "16px",
                              marginRight: "4px",
                            }}
                          />
                          <ListItemText
                            className="List-Item-text"
                            onClick={() => handleToggleCompletedState(todo.id)}
                          >
                            Mark Completed
                          </ListItemText>
                        </>
                      ) : (
                        <>
                          <CachedIcon
                            style={{
                              color: "#8d8989",
                              width: "16px",
                              marginRight: "4px",
                            }}
                          />
                          <ListItemText
                            className="List-Item-text"
                            onClick={() => handleToggleCompletedState(todo.id)}
                          >
                            Mark Undone
                          </ListItemText>
                        </>
                      )}
                    </ListItemIcon>

                    <ListItemSecondaryAction className="marginT">
                      <IconButton
                        onClick={() => {
                          setIsEditing(todo.id); // Set isEditing to todo id when clicking edit
                        }}
                      >
                        <EditNoteIcon />
                        <ListItemText className="List-Item-text gray">
                          Edit
                        </ListItemText>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          toast.success(" Todo status updated Successfully!");
                          removeTodo(todo.id);
                        }}
                      >
                        <DeleteOutlineIcon style={{ color: "red" }} />
                        <ListItemText className="red">Delete</ListItemText>
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </>
            </ListItem>
          ))}
        </List>
      </form>
    </Container>
  );
}

export default App;
