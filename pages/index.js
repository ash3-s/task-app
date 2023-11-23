import { Inter } from "next/font/google";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Navbar from "./navbar";
import { useRouter } from "next/router";
import TaskDetails from "./TaskDetails";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const router = useRouter();

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 9999);
  };

  const handleKeyUp = (key) => {
    if (key === "Enter" && newTodo && newDescription) {
      const randomNumber = getRandomNumber();

      const newItem = {
        id: `item-${randomNumber}`,
        title: newTodo,
        description: newDescription,
      };

      setTodo([...todo, newItem]);

      setNewTodo("");
      setNewDescription("");
    }
  };

  const handleDelete = (id) => {
    if (id > -1) {
      setTodo(todo.slice(0, id).concat(todo.slice(id + 1)));
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const items = reorder(todo, source.index, destination.index);

    setTodo(items);
  };
  const handlesubmit = async (e) => {
    if (newTodo && newDescription) {
      e.preventDefault();
      const randomNumber = getRandomNumber();

      const newItem = {
        id: `item-${randomNumber}`,
        title: newTodo,
        description: newDescription,
      };

      setTodo([...todo, newItem]);

      setNewTodo("");
      setNewDescription("");
    } else {
      alert("Please provide both task name and description");
    }
  };

  return (
    <>
      <div className="fade-in flex justify-center items-center ">
        <Navbar></Navbar>
      </div>
      <div className="fade-in flex justify-center pt-40">
        <div className="max-w-sm w-full shadow-lg bg-white p-8 rounded-xl opacity-70">
          <form>
            <input
              type="text"
              id="newTodo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyUp={(e) => handleKeyUp(e.key)}
              placeholder="Add new task"
              className="input input-bordered w-full max-w-xs"
            />

            <textarea
              className="textarea textarea-bordered mt-2"
              placeholder="Description  "
              onChange={(e) => setNewDescription(e.target.value)}
              value={newDescription}
            ></textarea>
            <button
              type="submit"
              onClick={handlesubmit}
              className=" flex btn btn-success"
            >
              Submit
            </button>
          </form>

          <div className="relative mt-10">
            <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none"></div>
          </div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                >
                  <ul className="block w-full pt-6">
                    {todo?.map((item, index) => {
                      return (
                        <Draggable
                          draggableId={item.id}
                          key={item.id}
                          index={index}
                        >
                          {(draggableProvided) => (
                            <div
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              ref={draggableProvided.innerRef}
                            >
                              <li
                                key={item.id}
                                className="w-full border-2 rounded-xl mt-2 hover:border-blue-300"
                              >
                                <input
                                  id={index}
                                  type="checkbox"
                                  className="float-left block w-6 h-6 m-3"
                                />
                                <button
                                  id={index}
                                  onClick={() => handleDelete(index)}
                                  className="float-right w-20 h-7 m-2.5 rounded-2xl bg-red-700 text-gray-200 shadow-md hover:bg-red-500 hover:scale-105"
                                >
                                  delete
                                </button>
                                <label
                                  htmlFor={index}
                                  className="block w-full p-3"
                                >
                                  {item.title}
                                  <div> {item.description}</div>
                                </label>
                              </li>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </ul>
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </>
  );
}
