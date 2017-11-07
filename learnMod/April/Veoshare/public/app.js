alert("hello");
(function(){
	  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyALxLWKCNLarn6KSUN22d3YN_8nJ7HXv1U",
    authDomain: "psychic-cycling-185003.firebaseapp.com",
    databaseURL: "https://psychic-cycling-185003.firebaseio.com",
    projectId: "psychic-cycling-185003",
    storageBucket: "",
    messagingSenderId: "437139562140"
  };
  firebase.initializeApp(config);

  //Get elements
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogout = document.getElementById('btnLogout');
  //Add login event
  btnLogin.addEventListener('click', e =>{
  	//Get email and password
  	const email = txtEmail.value;
  	const pass = txtPassword.value;
  	const auth = firebase.auth();
  	//Sign in 
  	const promise = auth.signInWithEmailAndPassword(email,pass);
  	promise.catch(e => console.log(e.message));
  });
  //Add signup event
  btnSignUp.addEventListener('click', e =>{
  	//Get email and password
  	//TODO: check 4 real emailz
  	const email = txtEmail.value;
  	const pass = txtPassword.value;
  	const auth = firebase.auth();
  	//Sign in 
  	const promise = auth.createUserWithEmailAndPassword(email,pass);
  	promise.catch(e => console.log(e.message));  	
  });

  btnLogout.addEventListener('click', e =>{
  	firebase.auth().signOut();
  });

  //Add a realtime listener
  firebase.auth().onAuthStateChanged(firebaseUser =>{
  	if(firebaseUser){
  		console.log(firebaseUser);
  		btnLogout.classList.remove('hide');
  	}else{
  		console.log('not logged in');
  		btnLogout.classList.add('hide');
  	}
 
  });

});