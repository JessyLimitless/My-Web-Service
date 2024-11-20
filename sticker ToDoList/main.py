import tkinter as tk
from tkinter import ttk
from tkinter import font as tkFont

# Create the main window
root = tk.Tk()
root.title("Stylish Sticky Note with To-Do List")  # Set the window title
root.geometry("400x350")  # Adjusted window size
root.configure(bg="#f0f8ff")  # Bright background color (light blue)
root.resizable(False, False)  # Disable window resizing

# Use a trendy custom font
custom_font = tkFont.Font(family="Roboto", size=10)  # Use "Roboto" for a modern look

# Header Label
header = tk.Label(root, text="Today's To-Do List", bg="#f0f8ff", fg="#333333", font=("Roboto", 14, "bold"))
header.pack(pady=10)

# Frame for the to-do list
todo_frame = tk.Frame(root, bg="#ffffff", bd=2, relief="flat", highlightbackground="#87cefa", highlightthickness=2)
todo_frame.pack(pady=10, padx=15, fill="both", expand=True)

# Task management list
tasks = []

# Function to add a new task
def add_task():
    task_text = task_entry.get().strip()
    if task_text:  # Only add if the text is not empty
        var = tk.BooleanVar()  # Variable for the checkbox
        cb = tk.Checkbutton(todo_frame, text=task_text, variable=var, bg="#ffffff", fg="#000000",
                            font=custom_font, anchor="w", selectcolor="#e6f7ff")
        cb.pack(anchor="w", pady=2)  # Add the checkbox
        tasks.append((cb, var))  # Add the task to the list as a tuple of the Checkbutton and BooleanVar
        task_entry.delete(0, "end")  # Clear the entry field

# Function to delete a selected task
def delete_task():
    for cb, var in tasks:
        if var.get():  # Check if the checkbox is selected
            cb.destroy()  # Remove the Checkbutton from the UI
    # Remove selected tasks from the tasks list
    tasks[:] = [(cb, var) for cb, var in tasks if not var.get()]

# Input Frame
input_frame = tk.Frame(root, bg="#f0f8ff")  # Frame to hold the entry and buttons side by side
input_frame.pack(pady=5)


# Styled Entry widget for task input
style = ttk.Style()
style.configure("TEntry", padding=5, relief="flat", background="#ffffff", foreground="#333333", bordercolor="#87cefa")

task_entry = ttk.Entry(input_frame, font=custom_font, width=23, style="TEntry")  # Adjusted width

# Bind the Enter key to the add_task function
task_entry.bind("<Return>", lambda event: add_task())

task_entry.pack(side="left", padx=5)

# Emoticon Buttons with Further Reduced Size
add_button = tk.Button(input_frame, text="➕", command=add_task, bg="#87cefa", fg="#ffffff",
                       font=("Roboto", 7, "bold"), bd=0, width=2, height=1)  # Further reduced size
add_button.pack(side="left", padx=3)

delete_button = tk.Button(input_frame, text="❌", command=delete_task, bg="#1e90ff", fg="#ffffff",
                          font=("Roboto", 7, "bold"), bd=0, width=2, height=1)  # Further reduced size
delete_button.pack(side="left", padx=3)

# Run the main loop to display the window
root.mainloop()
