/** LCARS SDK 16323.311
* This file is a part of the LCARS SDK.
* https://github.com/AricwithanA/LCARS-SDK/blob/master/LICENSE.md
* For more information please go to http://www.lcarssdk.org.
**/

var visualGuide = {
		currentView:null,
		uiColors:['bg-blue-1', 'bg-blue-2','bg-blue-3','bg-blue-4','bg-green-1','bg-green-2','bg-green-3','bg-green-4']
};

visualGuide.events = {
	animateLevelBar:{
		bars:{},
		init:function(){
			var elemID = $(this).attr('id');
			visualGuide.events.animateLevelBar.bars[elemID] = setInterval(function(){visualGuide.events.animateLevelBar.timer(elemID);}, 1000);
		},

		timer:function(elemID){
			if($('#'+elemID).length){
				$('#'+elemID).objectSettings({level:Math.floor((Math.random() * 100) + 1)});
			}else{
				clearInterval(visualGuide.events.animateLevelBar.bars[elemID]);
				visualGuide.events.animateLevelBar.bars[elemID] = null;
			}
		}
	}
}

var uiColors = ['bg-blue-1', 'bg-blue-2','bg-blue-3','bg-blue-4','bg-green-1','bg-green-2','bg-green-3','bg-green-4'];

//Template for the Bracket Element
var bracket = {type:'wrapper', class:'sdk bracket typeA', children:[
		{type:'wrapper', class:'content'},
		{type:'elbow', version:'top-left', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},
		{type:'elbow', version:'top-right', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},
		{type:'elbow', version:'bottom-left', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},
		{type:'elbow', version:'bottom-right', size:'small', color:LCARS.colorGen(uiColors), children:[{type:'bar'}], noEvent:true},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors), children:[{type:'bar', color:'bg-white'}]},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}
		]},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}
		]},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors), children:[{type:'bar', color:'bg-white'}]},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}
		]},
		{type:'column', flex:'v', children:[
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)},
			{type:'bar', flexC:'v', color:LCARS.colorGen(uiColors)}
		]}
	]
};

//UI Framing.  Uses the Arrive event to trigger the Viewport scaling.
var nemesisUI = {type:'wrapper', id:'wpr_viewport', version:'row', flex:'h', arrive:function(){$(this).viewport('zoom', {width:500, height:650});}, children:[

	//Main Area
    {type:'wrapper', version:'column', id:'wpr_mainView', flex:'v', flexC:'h', children:[

		//Main Content Area
        {type:'wrapper', class:'main', flex:'h', flexC:'v', children:[

			//Left Columns & Elbow
            {type:'wrapper', version:'column', flex:'v', children:[
                {type:'elbow', version:'top-left', color:"bg-green-3", label:VESSEL_NAME, class:'step-two'},
                {type:'button', color:LCARS.colorGen(uiColors), id:'magheading', label:MAGNETIC_HEADING},
                {type:'button', color:LCARS.colorGen(uiColors), id:'courseoverground', label:COURSE_OVER_GROUND},
								{type:'button', color:LCARS.colorGen(uiColors), style:'font-size: 300%;', text:CREW[0].deviceNotConnected, label:CREW[0].name},
                {type:'button', color:LCARS.colorGen(uiColors), style:'font-size: 300%;', text:CREW[1].deviceNotConnected, label:CREW[1].name},
                {type:'button', color:LCARS.colorGen(uiColors), id:'shipsposition', label:'latitude: --\nlongitude: --', size:'step-two'},
                {type:'button', color:LCARS.colorGen(uiColors), flexC:'v'}
            ]},

			{type:'column', flexC:'h', flex:'v', children:[
				//Top Bars Group
				{type:'row', flex:'h', class:'frame', children:[
					{type:'bar', color:LCARS.colorGen(uiColors)},
					{type:'bar', color:LCARS.colorGen(uiColors), version:'small'},
					{type:'bar', color:LCARS.colorGen(uiColors)},
					{type:'bar', color:LCARS.colorGen(uiColors), flexC:'h'},
					{type:'bar', color:LCARS.colorGen(uiColors)},
					{type:'bar', color:LCARS.colorGen(uiColors)},
					{type:'bar', color:LCARS.colorGen(uiColors)}
				]},

				//Main Content Wrapper
				{type:'wrapper', class:'content', flexC:'v', style:'overflow:auto;margin-top:-30px;', children:[
					{type:'htmlTag', tag:'h3', style:'margin-bottom:0px;', text:'Wind Speed', color:"text-blue-1"},
					{type:'complexButton', text:'--', id:'currentwindspeed', label:CURRENT_SPEED_IN_KNOTS, template:LCARS.templates.sdk.buttons.complexText.typeG, colors: ["bg-blue-1", "bg-blue-1", "bg-blue-1"]},
					{type:'row', flex:'v', id:'aggregatewindspeed', style:'margin-top:10px;', children:[
						{type:'column', flex:'v', flexC:'h', children:[
							{type:'complexButton', text:'--', id:'averagewindspeed', label:'Avg', template:LCARS.templates.sdk.buttons.complexText.typeA, color:"bg-green-3"}
						]},
						{type:'column', flex:'v', flexC:'h', style:'', children:[
							{type:'complexButton', text:'--', id:'maximumwindspeed', label:'Max', template:LCARS.templates.sdk.buttons.complexText.typeAR, color:"bg-green-1"}
						]},
					]},
					{type:'htmlTag', tag:'h3', style:'margin-bottom:0px;', text:'Depth', color:"text-blue-2"},
					{type:'complexButton', text:'---', id:'currentdepth', label:CURRENT_DEPTH_IN_FEET, template:LCARS.templates.sdk.buttons.complexText.typeG, colors: ["bg-blue-2", "bg-blue-2", "bg-blue-2"]},
					{type:'row', id:'recentdepth', arrive:function(){$(this).find('.levelBar').each(function(){$(this).objectSettings({level:Math.round(Math.random()*100) + 1});});}, children:[
						{type:'column', style:'height:180px;', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
						{type:'column', children:[
							{type:'levelBar', orient:'vertical', color:LCARS.colorGen(uiColors), label:'50', level:50, labelLink:'label' },
						]},
					]},
					{type:'htmlTag', tag:'h3', style:'margin-bottom:0px;', text:'Boat Speed', color:"text-blue-3"},
					{type:'levelBar', color:'bg-blue-3', id:'speedthroughwater', label:'50', level:50, labelLink:'label'},
					{type:'levelBar', color:'bg-green-3', id:'speedoverground', label:'50', level:50, labelLink:'label'},
				]}
    	]}
		]}
    ]}
]};

$(document).on('ready', function(){
	$(nemesisUI).createObject({appendTo:'body'});
});
