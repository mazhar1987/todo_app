import { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core';
import Todo from './Components/Todo/Todo';
import firebaseStore from './firebase';
import firebase from 'firebase';

import './App.css';

function App() {
	const [todos, setTodos] = useState([]);
	const [input, setInput] = useState('');

	// when the app loads, we need to listen to the database and fetch new todos when user added/removed
	useEffect(() => {
		// this code will fire when app.js loads (Read data from database)
		firebaseStore
			.collection('todos')
			.orderBy('timestamp', 'desc')
			.onSnapshot((snapshot) => {
				setTodos(snapshot.docs.map((doc) => doc.data().todo));
			});
	}, []);

	const addTodo = (event) => {
		// Will stop the refresh
		event.preventDefault();

		// Store todo item in to database that inputed by users
		firebaseStore.collection('todos').add({
			todo: input,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});

		// It will be fire of when we will click on the button
		setTodos([...todos, input]);

		// Clearup the input field after click on the button
		setInput('');
	};

	return (
		<div className='App'>
			<h1>Hello World</h1>
			<form>
				<FormControl>
					<InputLabel htmlFor='writeTodo'>✅ Write a todo</InputLabel>
					<Input
						id='writeTodo'
						type='text'
						value={input}
						onChange={(event) => setInput(event.target.value)}
					/>
				</FormControl>

				<Button
					type='submit'
					onClick={addTodo}
					disabled={!input}
					variant='contained'
					color='primary'>
					Add Todo
				</Button>
			</form>
			<ul>
				{todos.map((todo, index) => (
					<Todo key={index.toString()} text={todo} />
				))}
			</ul>
		</div>
	);
}

export default App;
