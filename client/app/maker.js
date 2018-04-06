const handleIndustry = (e) => {
	e.preventDefault();
	
	$("#industryMessage").animate({width:'hide'},350);
	
	if($("#industryName").val() == ''){
		handleError("RAWR! All fields are required");
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
			<input type="hidden" name="_csrf" value={props.csrf} />
			<input className="makeIndustrySubmit" type="submit" value="Make Industry"/>
		</form>
	);
};

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
		return(
			<div key={industry._id} className="industry" style={{backgroundColor: industry.color}}>
				<img src="/assets/img/domoface.jpeg" alt="industry face" className="industryFace" />
				<h3 className="industryName"> Name: {industry.name} </h3>
				//<h3 className="domoAge"> Age:{domo.age} </h3>
			</div>
		);
	});
	
	return(
		<div className="industrylist">
			{industryNodes}
		</div>
	);
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