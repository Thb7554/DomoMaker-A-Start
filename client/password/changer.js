const changePassword = (e) => {
	e.preventDefault();
	
	if($("#pass3").val() != $("#pass4").val()){
		handleError("Passwords do not match!");
		return false;
	}

	if($("#pass3").val() == "" || $("#pass4").val() == "" ){
		handleError("All fields are required!");
		return false;
	}
	
	sendAjax('POST', $("#passForm").attr("action"), $("#passForm").serialize(), function(){
		console.log("Changed!");
	});
	return false;
}



const PasswordForm = (props) => {
	return (
		<form id="passForm"
			  onSubmit={changePassword}
			  name="passForm"
			  action="/changePassword"
			  method="POST"
			  className="changeForm"
		>
			<label htmlFor="pass3">New Password: </label>
			<input id="pass3" type="password" name="pass3" placeholder="new password"/>
			<input type="hidden" name="_csrf" value={props.csrf}/>
			<label htmlFor="pass4">Re-type Password: </label>
			<input id="pass4" type="password" name="pass4" placeholder="re-type password"/>
			<input type="hidden" name="_csrf" value={props.csrf}/>
			<input className="formSubmit" type="submit" value="Change Password"/>
		</form>
	);
};

const setup = function(csrf) {
	ReactDOM.render(
		<PasswordForm csrf={csrf} />, document.querySelector("#content")
	);
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
		setup(result.csrfToken);
	});
};

$(document).ready(function() {
	getToken();
});