# Python Password Manager (`project4.py`)

A simple command-line password manager developed in Python, designed to securely store and retrieve account credentials. It utilizes the `cryptography` library to encrypt passwords before saving them to a local file, and requires a master password for access.

## Features

*   **Secure Storage**: Passwords are encrypted using the `Fernet` symmetric encryption scheme from the `cryptography` library.
*   **Master Password Protection**: Requires a predefined master password to access the password manager functionalities.
*   **Add Passwords**: Allows users to add new account names and their corresponding passwords.
*   **View Passwords**: Displays all saved account names and their decrypted passwords.
*   **User-Friendly Interface**: Simple command-line interaction for adding, viewing, and quitting.

## Big-O Complexity Analysis

The complexity of the password manager largely depends on the number of stored entries and their lengths, particularly during operations that involve reading the entire password file.

| Operation | Time Complexity | Space Complexity | Explanation |
| :-------- | :-------------- | :--------------- | :---------- |
| **Initial Setup** | `O(1)` | `O(1)` | Key generation/loading, Fernet object creation, and master password check are constant time/space operations. |
| **`add()` function** | `O(L_new)` | `O(L_new)` | Proportional to the length of the new account name and password being added (`L_new`). This includes input handling, encryption, and appending to the file. |
| **`view()` function** | `O(N * L)` | `O(N * L)` | Dominated by reading all `N` lines from the `passwords.txt` file and processing each line. `L` is the average length of an entry. `f.readlines()` loads all entries into memory. |
| **Overall (Scaling)** | `O(N * L)` | `O(N * L)` | When considering the application's ability to scale with stored data, the `view()` function's complexity becomes the dominant factor for both time and space. |

*Note: `N` represents the number of saved password entries, and `L` represents the average length of an individual entry (account name + encrypted password string).*

## Setup and Installation

To run this password manager locally, follow these steps:

### Prerequisites

*   Python 3.x installed on your system.

### Local Setup for `project4.py`

1.  **Install `cryptography` library**:
    This script relies on the `cryptography` library. You can install it using pip:
    ```bash
pip install cryptography
    ```

2.  **Save the Script**:
    Save the provided `project4.py` content into a file named `project4.py` on your local machine.

## Usage

1.  **Run the script**:
    Open your terminal or command prompt, navigate to the directory where you saved `project4.py`, and execute:
    ```bash
python project4.py
    ```

2.  **Enter Master Password**:
    When prompted, enter the master password. The default master password is `password123`.
    ```
    ===== Password Manager =====
    Enter Master Password: password123
    ```

3.  **Choose an Option**:
    You will be presented with options to `add` a new password, `view` existing passwords, or `quit` the application.

    *   **Add a new entry**:
        ```
        Choose an option (add/view/quit): add
        Account Name: mybank
        Password: mysecurepassword123
        Password Saved Successfully!
        ```

    *   **View saved entries**:
        ```
        Choose an option (add/view/quit): view

        ===== Saved Passwords =====
        Account: mybank
        Password: mysecurepassword123
        ------------------------------
        ```

    *   **Quit the application**:
        ```
        Choose an option (add/view/quit): quit
        Goodbye!
        ```

### Important Notes:
*   A file named `key.key` will be created in the same directory as `project4.py` to store your encryption key. **Do not delete or share this file**, as it's essential for decrypting your passwords.
*   Passwords will be stored in an encrypted format in `passwords.txt`.

## GitHub Repository Context: `javapractice`

The following file structure was retrieved from the provided GitHub repository `https://github.com/ManasDevHub00/javapractice`. Please note that the `project4.py` script provided for documentation is a standalone Python application and is not part of this Java-centric repository. This structure is included purely for contextual understanding of the repository linked in the request.

```
javapractice/
├── Javalab/
│   ├── A.class
│   ├── A1.class
│   ├── ... (many other .class and .java files)
│   ├── MyThread2.java
│   ├── Practical1.java
│   ├── Practical10a.java
│   ├── Practical10b.java
│   ├── Practical11.java
│   ├── Practical12.java
│   ├── Practical13.java
│   ├── Practical14.java
│   ├── Practical15.java
│   ├── Practical16.java
│   ├── Practical19.java
│   ├── Practical2.java
│   ├── Practical20.java
│   ├── Practical2122.java
│   ├── Practical23.java
│   ├── Practical24.java
│   ├── Practical25.java
│   ├── Practical3.java
│   ├── Practical4.java
│   ├── Practical5.java
│   ├── Practical6.java
│   ├── Practical7.java
│   ├── Practical8.java
│   ├── Practical9.java
│   ├── TestArea.java
│   ├── TestShape.java
│   ├── Throws.java
│   ├── mypack/
│   │   ├── ABC.java
│   │   ├── ABC1.java
│   │   └── ABC2.java
│   ├── mypack1/
│   │   ├── ABC3.java
│   │   └── ABC4.java
│   └── pack2/
│       └── Calc.java
└── README.md (Potentially, if one exists in the actual repo)
```

## License

This project is open-source and available under the MIT License. (You may want to choose a specific license if distributing).