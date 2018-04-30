var playerMoney;

const handleIndustry = (e) => {
	e.preventDefault();
	
	console.dir(playerMoney);
	
	if($("#industryName").val() == ''){
		handleError("Factory needs a name!");
		return false;
	}
	
	
	sendAjax('POST', $("#industryForm").attr("action"), $("#industryForm").serialize(), function(){
		loadIndustriesFromServer();
	});
	
	return false;
}



const IndustryForm = (props) => {
	return (
		<form id="industryForm"
			  onSubmit={handleIndustry}
			  name="industryForm"
			  action="/maker"
			  method="POST"
			  className="industryForm"
		>
			<label htmlFor="name">Name: </label>
			<input id="industryName" type="text" name="name" placeholder="Industry Name"/>
			<label htmlFor="Type">Type: </label>
			<select name="resource">
				<option value="wood">Wood</option>
				<option value="steel">Steel</option>
				<option value="power">Power</option>
			</select>
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input type="hidden" name="price" value="100"/>
			<input className="makeIndustrySubmit" type="submit" value="Make Industry"/>
		</form>
	);
};

const AccountData = function(props){
	//console.dir(props);
	if(props.account.account.money === null){
		return(
			<div className="account">
				<h3 className="emptyIndustry">Account not found!</h3>
			</div>
		);
	}
	playerMoney = props.account.account.money;
	return(
		<div key={props.account.account.username} className="account">
			<img src="/assets/img/money.png" alt="money" className="money" />
			<h3> Money: {props.account.account.money} </h3>
		</div>
	);
}

const IndustryList = function(props){
	if(props.industries.length === 0){
		return(
			<div className="industryList">
				<h3 className="emptyIndustry">No Industries yet</h3>
			</div>
		);
	}
	//#603912
	const industryNodes = props.industries.map(function(industry){
	
		var imgSrc;
		if(industry.resource == "wood"){
			imgSrc = "/assets/img/wood.png";
		}
		if(industry.resource == "steel"){
			imgSrc = "/assets/img/steel.png";
		}
		if(industry.resource == "power"){
			imgSrc = "/assets/img/power.png";
		}
	
		return(
			<div key={industry._id} className="industry" style={{backgroundColor: industry.color}}>
				<img src={imgSrc} alt="industry face" className="industryFace" />
				<h3 className="industryName"> Name: {industry.name} </h3>
				<h3 className="resource"> {industry.resource}: {industry.resourceAmount} </h3>
				<h3 className="resource"> Cost: {industry.cost} </h3>
				<h3 className="resource"> Level: {industry.level} </h3>
			</div>
		);
	});
	
	return(
		<div className="industrylist">
			{industryNodes}
		</div>
	);
};

const loadAccountFromServer = () => {
	sendAjax('GET','/getAccount',null,(data) => {
		playerMoney = data;
		//console.dir(data);
		ReactDOM.render(
		<AccountData account={data} />, document.querySelector("#account")
		);
	});
};

const loadIndustriesFromServer = () => {
	sendAjax('GET','/getIndustries',null,(data) => {
		ReactDOM.render(
			<IndustryList industries={data.industries} />, document.querySelector("#industries")
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<IndustryForm csrf={csrf} />, document.querySelector("#makeIndustry")
	);
	
	ReactDOM.render(
		<IndustryList industries={[]} />, document.querySelector("#industries")
	);

	const account = {
		account :{
			money : 0
		}
	};
	
	ReactDOM.render(
		<AccountData account={account} />, document.querySelector("#account")
	);
	

	loadAccountFromServer();
	loadIndustriesFromServer();
};

const getToken = () => {
	sendAjax('GET', '/getToken', null, (result) => {
	  setup(result.csrfToken);
	});
};

$(document).ready(function(){
	getToken();
});