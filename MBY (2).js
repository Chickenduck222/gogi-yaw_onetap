/*
    Meat Beat Yaw
    Author: Camden
*/

// Welcome logs
Cheat.PrintLog("================[INFO]================", [255, 153, 153, 255])
Cheat.PrintLog("Meatbeat.yaw | discord.gg/dtpMdKpCj9", [240, 240, 240, 255])
Cheat.PrintLog("Meatbeat.yaw | sellix.io/Camden", [240, 240, 240, 255])
Cheat.PrintLog("================[CRED]================", [255, 153, 153, 255])
Cheat.PrintLog("Meatbeat.yaw | Camden", [240, 240, 240, 255])
Cheat.PrintLog("Meatbeat.yaw | Winter", [240, 240, 240, 255])
Cheat.PrintLog("Meatbeat.yaw | Jace", [240, 240, 240, 255])
Cheat.PrintLog("================[INFO]================", [255, 153, 153, 255])
Cheat.PrintLog("Meatbeat.yaw | Welcome " + Cheat.GetUsername() + "!", [240, 240, 240, 255])
Cheat.PrintLog("Meatbeat.yaw | Last update: 7/04/21", [240, 240, 240, 255])
Cheat.PrintLog("================[UPDS]================", [255, 153, 153, 255])
Cheat.PrintLog("Meatbeat.yaw | Added a doubletap damage prediction", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added a fakelag system (broken)", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added some overhead target warnings", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Changed the ideal tick and reset stages warnings", [235, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Further improved break prediction modes", [235, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Redid tick antiaim", [235, 255, 60, 255])   
Cheat.PrintLog("Meatbeat.yaw | Ideal tick now forces an experimental freestanding mode", [235, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Updated ragebot fire logs", [235, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added a new indicator type #ATOZ", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Improved doubletap types", [235, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Completely recoded the antiaim including new presets", [235, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added display settings", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added a min dmg override as highly requested", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added back the killsay", [60, 255, 60, 255])
Cheat.PrintLog("Meatbeat.yaw | Added options to the ideal tick", [60, 255, 60, 255])

// Math + Fixes
function get_velocity(player) {
	var x,y,z = Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]" );
	if (x == 0) { 
        return end
    }
	return Math.sqrt(x*x + y*y + z*z)
}

function get_max_body_yaw(player) {
	var x,y,z = Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]" );
	return (58 - (Math.sqrt(x ^ 2 + y ^ 2) * 58)) * -1
}

Render.AddFont = function( name, size, weight ) { // addfont -> getfont
    return Render.GetFont( name.concat( ".ttf" ), size, true ) 
}

function deg2rad( degress ) { // degrees to a radian
    return degress * Math.PI / 180.0;
}

function angle_to_vec( pitch, yaw ) { // angle to a vector
    var p = deg2rad( pitch );
    var y = deg2rad( yaw )
    var sin_p = Math.sin( p );
    var cos_p = Math.cos( p );
    var sin_y = Math.sin( y );
    var cos_y = Math.cos( y );
    return [ cos_p * cos_y, cos_p * sin_y, -sin_p ];
}

function trace( entity_id, entity_angles ) { // eyeangles distance tracing
    var entity_vec = angle_to_vec( entity_angles[0], entity_angles[1] );
    var entity_pos = Entity.GetRenderOrigin( entity_id );
    entity_pos[2] += 50;
    var stop = [ entity_pos[ 0 ] + entity_vec[0] * 8192, entity_pos[1] + entity_vec[1] * 8192, ( entity_pos[2] )  + entity_vec[2] * 8192 ];
    var traceResult = Trace.Line( entity_id, entity_pos, stop );
    if( traceResult[1] == 1.0 )
        return;
    stop = [ entity_pos[ 0 ] + entity_vec[0] * traceResult[1] * 8192, entity_pos[1] + entity_vec[1] * traceResult[1] * 8192, entity_pos[2] + entity_vec[2] * traceResult[1] * 8192 ];
    var distance = Math.sqrt( ( entity_pos[0] - stop[0] ) * ( entity_pos[0] - stop[0] ) + ( entity_pos[1] - stop[1] ) * ( entity_pos[1] - stop[1] ) + ( entity_pos[2] - stop[2] ) * ( entity_pos[2] - stop[2] ) );
    entity_pos = Render.WorldToScreen( entity_pos );
    stop = Render.WorldToScreen( stop );
    if( stop[2] != 1 || entity_pos[2] != 1 )
        return;

    return distance;
}

function RandomInt(min, max) { // Rounded math.random
    return Math.floor(Math.random() * (max - min)) + min;
}

function clamp(num, min, max) { // clamp angles
    return num <= min ? min : num >= max ? max : num;
}

function getVelocity() { // get entity velocity
    var velocity = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]" );
    var speed = Math.sqrt( velocity[0] * velocity[0] + velocity[1] * velocity[1] );
    return speed;
}

function getvelo(player) { // get entity velocity
    var velocity = Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]" );
    var speed = Math.sqrt( velocity[0] * velocity[0] + velocity[1] * velocity[1] );
    return speed;
}

function ExtendVector(vector, angle, extension) { // extend a vector
    var radianAngle = radian(angle);
    return [extension * Math.cos(radianAngle) + vector[0], extension * Math.sin(radianAngle) + vector[1], vector[2]];
}

function VectorAdd(a, b) { // add vectors
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function VectorSubtract(a, b) { // subtract vectors
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function VectorMultiply(a, b) { // multiply vectors
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function VectorLength(x, y, z) { // return vector length
    return Math.sqrt(x * x + y * y + z * z);
}

function VectorNormalize(vec) { // normalise vector length
    var length = VectorLength(vec[0], vec[1], vec[2]);
    return [vec[0] / length, vec[1] / length, vec[2] / length];
}

function VectorDistance(a, b) { // return vector distance
    return VectorLength(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function VectorDot(a, b) { // better vector multiplication
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function ClosestPointOnRay(target, rayStart, rayEnd) { // returns closest target point
    var to = VectorSubtract(target, rayStart);
    var dir = VectorSubtract(rayEnd, rayStart);
    var length = VectorLength(dir[0], dir[1], dir[2]);
    dir = VectorNormalize(dir);

    var rangeAlong = VectorDot(dir, to);
    if (rangeAlong < 0.0)
    {
        return rayStart;
    }
    if (rangeAlong > length)
    {
        return rayEnd;
    }
    return VectorAdd(rayStart, VectorMultiply(dir, [rangeAlong, rangeAlong, rangeAlong]));
}

function maxdsy(player) {
    var speed = getvelo(player);
    var delta = (speed / 8);
    return (60 - delta);
}

function getHitboxName(index) { // retrieve hitbox names
    var hitboxName = "";
    switch (index) {
        case 0:
            hitboxName = "head";
            break;
        case 1:
            hitboxName = "neck";
            break;
        case 2:
            hitboxName = "pelvis";
            break;
        case 3:
            hitboxName = "body";
            break;
        case 4:
            hitboxName = "thorax";
            break;
        case 5:
            hitboxName = "chest";
            break;
        case 6:
            hitboxName = "upper chest";
            break;
        case 7:
            hitboxName = "left thigh";
            break;
        case 8:
            hitboxName = "right thigh";
            break;
        case 9:
            hitboxName = "left calf";
            break;
        case 10:
            hitboxName = "right calf";
            break;
        case 11:
            hitboxName = "left foot";
            break;
        case 12:
            hitboxName = "right foot";
            break;
        case 13:
            hitboxName = "left hand";
            break;
        case 14:
            hitboxName = "right hand";
            break;
        case 15:
            hitboxName = "left upper arm";
            break;
        case 16:
            hitboxName = "left forearm";
            break;
        case 17:
            hitboxName = "right upper arm";
            break;
        case 18:
            hitboxName = "right forearm";
            break;
        default:
            hitboxName = "generic";
    }

    return hitboxName;
}

var misscount = 0
function misscounter() {
    var me = Entity.GetLocalPlayer();

    if (Entity.IsAlive(me) == false)
    return;

    shooter_id = Event.GetInt("userid");
    shooter = Entity.GetEntityFromUserID(shooter_id);

    if (Entity.IsEnemy(shooter) == false || Entity.IsDormant(shooter) == true)
    return;

    var head =  Entity.GetHitboxPosition(me, 0);
    var lx = head[0]
    var ly = head[1]
    var lz = head[2]

    var localorigin = Entity.GetProp(me, "CBaseEntity", "m_vecOrigin");
    var ox = localorigin[0]
    var oy = localorigin[1]
    var oz = localorigin[2]
    var enemyorigin = Entity.GetProp(shooter, "CBaseEntity", "m_vecOrigin");
    var ex = enemyorigin[0]
    var ey = enemyorigin[1]
    var ez = enemyorigin[2]

    var ix = Event.GetFloat("x");
    var iy = Event.GetFloat("y");
    var iz = Event.GetFloat("z");

    var dist = ((iy - ey) * lx - (ix - ex) * ly + ix * iy - iy*ex) / Math.sqrt((iy - ey)^2 + (ix - ex)^2)
    
    if (Math.abs(dist) <= 5000) {
        misscount = misscount + 1
    }
}
Cheat.RegisterCallback("bullet_impact", "misscounter")

var lphitcount = 0
function lphitcounter() {
    if (Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        misscount = 0
        lphitcount = lphitcount + 1
    }
}
Cheat.RegisterCallback("player_hurt", "lphitcounter")


var thitcount = 0
function thitcounter() {
    if (Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        thitcount = thitcount + 1
    }
}
Cheat.RegisterCallback("player_hurt", "thitcounter")

function lphitreset() {
    if (Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        lphitcount = 0
    }
}
Cheat.RegisterCallback("player_death", "lphitreset")

function thitreset() {
    if (Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        thitcount = 0
    }
}
Cheat.RegisterCallback("player_death", "thitreset")

// Navigation + Other
UI.AddSubTab(["Rage", "SUBTAB_MGR"], "meatbeat.yaw");
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.yaw", 0, 0);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.navigation", ["Home", "Rage", "Antiaim", "Visuals", "Misc"], 0);

function navigation() {
    UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage" ], 0 )

    // home
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.navigation"]) == 0) {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.home" ], 1 )
        //UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Import recommended settings" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour" ], 1 )
    } else {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.home" ], 0 )
        //UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Import recommended settings" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour" ], 0 )
    }

    // rage
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.navigation"]) == 1) {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.rage" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Doubletap preference" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick options" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick min dmg" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Predict doubletap damage" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Safe peek" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ragebot shot info" ], 1 )
    } else {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.rage" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Doubletap preference" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick options" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick min dmg" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Predict doubletap damage" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Safe peek" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ragebot shot info" ], 0 )
    }

    // antiaim
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.navigation"]) == 2) {
        // all  
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.yaw" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Adaptive freestanding" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Avoid high delta" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Break prediction" ], 1 )

        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 1) {
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw" ], 1 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions" ], 1 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter" ], 0 )
        } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 2) {
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw" ], 1 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit" ], 1 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter" ], 0 )
        } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 3) {
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types" ], 1 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter" ], 0 )
        } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 4) {
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options" ], 1 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks" ], 1 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter" ], 1 )
        } else {
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types" ], 0 )

            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks" ], 0 )
            UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter" ], 0 )
        }
    } else {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.yaw" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Adaptive freestanding" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Avoid high delta" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Break prediction" ], 0 )

        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions" ], 0 )

        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit" ], 0 )

        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types" ], 0 )

        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter" ], 0 )
    }

    // visuals
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.navigation"]) == 3) {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.vis" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Info bar preference" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Primary colour" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Secondary colour" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Alt colour" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Conditional side arrows" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Arrows colour" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings" ], 1 )
    } else {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.vis" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Info bar preference" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Primary colour" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Secondary colour" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Alt colour" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Conditional side arrows" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Arrows colour" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings" ], 0 )
    }

    // misc
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.navigation"]) == 4) {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.misc" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Killsay" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Minimum damage override" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Prestart autobuy" ], 1 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Target warnings" ], 1 )
    } else {
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "meatbeat.misc" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Killsay" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Minimum damage override" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Prestart autobuy" ], 0 )
        UI.SetEnabled( [ "Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Target warnings" ], 0 )
    }
}

// Home + Other
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.home", 0, 0);
//UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Import recommended settings");
UI.AddColorPicker(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Theme colour");

/*function settings() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Import recommended settings"])) {
        UI.SetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour"], [255, 255, 255, 255]);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Doubletap preference"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick min dmg"], 10);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Safe peek"], 0);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ragebot shot info"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"], 2);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Adaptive freestanding"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Danger types"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Danger deviation"], 4);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Avoid high delta"], 0);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Break prediction"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Info bar preference"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference"], 3);
        UI.SetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Primary colour"], [23, 23, 23, 255]);
        UI.SetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Secondary colour"], [255, 255, 255, 255]);
        UI.SetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Alt colour"], [23, 23, 23, 255]);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Conditional side arrows"], 0);
        UI.SetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Arrows colour"], [23, 23, 23, 255]);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display antiaim stage"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Prestart autobuy"], 1);
        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Import recommended settings"], 0);
    }
}*/

// Rage + Other
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.rage", 0, 0);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Doubletap preference", ["Default", "Distance", "Latency"], 0);
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Ideal tick");
UI.AddMultiDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Ideal tick options", ["Freestand", "Safepoint unsafe hitboxes", "Disable fakelag"], 0);
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Ideal tick min dmg", 1, 130);
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Predict doubletap damage");
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Safe peek");
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Ragebot shot info");

var type = "Dynamic"
var shift = 14
var tol = 2

function safepeek() {
    local = Entity.GetLocalPlayer();
    weapon = Entity.GetWeapon(local);
    wpname = Entity.GetName(weapon);
    classname = Entity.GetClassName(weapon);
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Safe peek"])) {
        if ((classname != "CKnife" || classname != "CWeaponSSG08" || wpname != "r8 revolver" || classname != "CHEGrenade" || classname != "CMolotovGrenade" || classname != "CIncendiaryGrenade" || classname != "CFlashbang" || classname != "CSmokeGrenade" || classname != "CDecoyGrenade" || classname != "CWeaponTaser" || classname != "CC4")) {
            if (left_distance < 700 && right_distance < 700) {
                Ragebot.ForceHitboxSafety(2)
                Ragebot.ForceHitboxSafety(3)
            } else {
                Ragebot.ForceHitboxSafety(0)
                Ragebot.ForceHitboxSafety(1)
            }
        }
    }
}

var hits = 0;
var lastUpdate = 0;
var dt_target = ""
var shot_fired = false
function fire() {
  
    var hit = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    var attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    if (attacker == Entity.GetLocalPlayer() && hit == target) hits++;
    ragebot_target = Event.GetInt("target_index");
    targetroflsauce = Entity.GetEntityFromUserID(ragebot_target);
    ragebot_target_hitbox = Event.GetInt("hitbox");
    ragebot_target_hitchance = Event.GetInt("hitchance");
    target_damage = Event.GetInt("dmg_health");
    ragebot_target_safepoint = Event.GetInt("safepoint");
    targetName = Entity.GetName(ragebot_target);

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ragebot shot info"])) {
        Cheat.PrintLog("fired shot at " + targetName + " [hb: " + getHitboxName(ragebot_target_hitbox) + " | hc:  " + ragebot_target_hitchance + " | ext: " + Math.floor((Math.random() * 24) + 1) + " | exp: " + Globals.ChokedCommands() + " / " + Math.round(Exploit.GetCharge().toFixed(2) * 100) + " | vel: " + Math.floor(getVelocity(Entity.GetLocalPlayer())) + " | mdsy: " + Math.round(maxdsy(hit)) + "*]", [255,255,255,255]);
        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true ) {
            dt_target = targetName
            shot_fired = true
        }
    }
}

function predict_doubletap_damage() {
    const enemies = Entity.GetEnemies();
    me = Entity.GetLocalPlayer();
    localwp = Entity.GetWeapon(me);
    wpn= Entity.GetName(localwp);
    if (wpn == "g3sg1" || wpn == "scar20") {
        for (i in enemies) {
            health = Entity.GetProp(enemies[i],"CBasePlayer", "m_iHealth")
            hp = Math.min(health,100)
            if (hp >= 50) {
                Ragebot.ForceTargetMinimumDamage(enemies[i], hp / 2)
            } else {
                Ragebot.ForceTargetMinimumDamage(enemies[i], hp)
            }
        }
    }
}

function idealtick() {
    var enemy = Ragebot.GetTarget();
    const firedshots = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_iShotsFired");
    idealticklol = UI.GetValue(["Misc.", "Keys", "Key assignment", "Auto peek"]);
    var tickdmg = UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick min dmg"]);
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick"])) {
        if (idealticklol == true) {
            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick options"]) & (1 << 0)) {
                if (getVelocity > 2) {
                    UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0);
                } else {
                    if (Input.IsKeyPressed(0x44)) { // left (D)
                        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], -90);
                    } else if (Input.IsKeyPressed(0x41)) { // right (A)
                        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 90);
                    } else {
                        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0);
                    }
                }
            } else {
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0);
            }
            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick options"]) & (1 << 1)) {
                Ragebot.ForceHitboxSafety(0)
                Ragebot.ForceHitboxSafety(1)
                Ragebot.ForceHitboxSafety(12)
                Ragebot.ForceHitboxSafety(11)
            }
            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick options"]) & (1 << 2)) {
                UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 0);
            }
            const enemies = Entity.GetEnemies();
            for (i in enemies) {
                Ragebot.ForceTargetMinimumDamage(enemies[i], tickdmg)
            }
            if (firedshots > 0) {
                // teleport
                if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true ) {
                    UI.ToggleHotkey(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"], "Double tap");
                }
            } else {
                Exploit.OverrideTolerance(0)
                Exploit.OverrideShift(17)
                if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == false ) {
                    UI.ToggleHotkey(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"], "Double tap");
                }
                UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
            }
        } else {
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0);
            UI.SetValue(["Rage", "Fake Lag", "General", "Enabled"], 1);
        }
    }
}

function accuracy() {
    // vars
    var local = Entity.GetLocalPlayer();
    var eye_angles = Local.GetViewAngles();
    left_distance = trace( local, [ 0, eye_angles[1] - 22] );
    right_distance = trace( local, [ 0, eye_angles[1] + 22] );

    var pinglol = Local.Latency();
    var pingmult = pinglol * 1000;
    var pingrounded = Math.round(pingmult);

    // doubletap acc boost
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Doubletap preference"]) == 0) {
        type = "Default"
        shift = 14
        tol = 1
        Exploit.OverrideTolerance(1)
        Exploit.OverrideShift(14)
        Exploit.OverrideMaxProcessTicks(16);
    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Doubletap preference"]) == 1) {
        type = "Distance"
        if (left_distance < 600 && right_distance < 600) {
            tol = 0
            Exploit.OverrideTolerance(0)
            if ( right_distance < left_distance ) {
                shift = 15
                Exploit.OverrideShift(15)
                Exploit.OverrideMaxProcessTicks(16);
            } else if ( left_distance > right_distance ) {
                shift = 14
                Exploit.OverrideShift(14)
                Exploit.OverrideMaxProcessTicks(16);
            }
        } else {
            tol = 1
            shift = 16
            Exploit.OverrideTolerance(1)
            Exploit.OverrideShift(16)
            Exploit.OverrideMaxProcessTicks(16);
        }
        //fart 
    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Doubletap preference"]) == 2) {
        type = "Latency"
        if (pingmult <= 20) {
            shift = 15
            tol = 0
            Exploit.OverrideTolerance(0)
            Exploit.OverrideShift(15)
            Exploit.OverrideMaxProcessTicks(17);
        } else if (pingmult <= 40) {
            shift = 15
            tol = 1
            Exploit.OverrideTolerance(1)
            Exploit.OverrideShift(15)
            Exploit.OverrideMaxProcessTicks(16);
        } else if (pingmult <= 65) {
            shift = 15
            tol = 2
            Exploit.OverrideTolerance(2)
            Exploit.OverrideShift(15)
            Exploit.OverrideMaxProcessTicks(16);
        } else if (pingmult <= 95) {
            shift = 14
            tol = 1
            Exploit.OverrideTolerance(1)
            Exploit.OverrideShift(14)
            Exploit.OverrideMaxProcessTicks(16);
        } else {
            shift = 14
            tol = 2
            Exploit.OverrideTolerance(2)
            Exploit.OverrideShift(14)
            Exploit.OverrideMaxProcessTicks(16);
        }
    }
}

// Antiaim + Other
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.yaw", 0, 0);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Antiaim preference", ["Default", "Prediction", "Status", "Tick", "Bruteforce"], 0);
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Adaptive freestanding");
// Tick
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Tick types", ["State", "Delta"], 0);
// Prediction
UI.AddMultiDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Body yaw", ["Predict", "Jitter"], 0);
UI.AddMultiDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Yaw conditions", ["Side Tracing", "Aggressive", "More Jitter"], 0);
// Status
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Main body yaw", ["Static", "Jitter"], 0);
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Deviation/Danger limit", 0, 10);
// Bruteforce
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Bruteforce stage", ["Jitter", "Default"], 0);
UI.AddMultiDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Automated reset options", ["Round End", "Time Since Stage Change > x ticks"], 0);
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Maximum surpassed ticks", 0, 1000);
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Shot inverter");
// All
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Avoid high delta");
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Break prediction", ["None", "Cringe", "Cool", "The Minion"], 0);
//UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Break prediction");

var clock = 0;
var left_distance;
var right_distance;
var fakeoffset = 0;
var realoffset = 0;
var lbyoffset = 0;
var switcher = 0;
var tick = 0;
var status = ""
var timelol = 0

function override() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) != 0) {
        AntiAim.SetOverride(1);
        AntiAim.SetFakeOffset(fakeoffset);
        AntiAim.SetRealOffset(realoffset);
        AntiAim.SetLBYOffset(lbyoffset);
    } else {
        AntiAim.SetOverride(0);
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) != 0) {

        var deviationlimit = UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Deviation/Danger limit"]);
        var deviation = 100 * deviationlimit;
    
        if (tick == 23) {
            tick = 0;
        } else {
            tick = tick + 1
        }

        if (switcher == 3) {
            switcher = 0;
        } else {
            switcher = switcher + 1
        }
    
        // Prediction
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 1) {
            if ((misscount >= 1 || lphitcount >= 1) && (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw"]) & (1 << 0))) {
                status = "calc.."
                realoffset = (misscount * 10) - (lphitcount * 10)
                fakeoffset = 0
                lbyoffset = 0
            } else if ((thitcount >= 1) && (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Body yaw"]) & (1 << 1))) {
                status = "jitter"
                if (switcher == 0) {
                    realoffset = -59
                } else if (switcher == 1) {
                    realoffset = -59
                } else if (switcher == 2) {
                    realoffset = 59
                } else if (switcher == 3) {
                    realoffset = 59
                }
                fakeoffset = 0
                lbyoffset = 0
            } else {
                if ((UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions"]) & (1 << 0)) && (right_distance < 590)) {
                    status = "tracing"
                    realoffset = right_distance / 10
                    fakeoffset = 0
                    lbyoffset = 0
                } else {
                    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions"]) & (1 << 1)) {
                        status = "minimal"
                        realoffset = 17
                        fakeoffset = 0
                        lbyoffset = 0
                    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Yaw conditions"]) & (1 << 2)) {
                        status = "danger"
                        realoffset = RandomInt(35,55)
                        fakeoffset = 0
                        lbyoffset = 0
                    } else {
                        status = "default"
                        realoffset = 35
                        fakeoffset = 0
                        lbyoffset = 0
                    }
                }
            }
        }

        // Status
        const lp = Entity.GetLocalPlayer();
        const lpflags = Entity.GetProp(lp, "CBasePlayer", "m_fFlags");
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 2) {
            if (lpflags == 256) {
                status = "air"
                if (switcher == 0) {
                    realoffset = 10
                } else if (switcher == 1) {
                    realoffset = 10
                } else if (switcher == 2) {
                    realoffset = 5
                } else if (switcher == 3) {
                    realoffset = 5
                }
                fakeoffset = -15
                lbyoffset = 0
            } else {
                if (Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount") > 0.4) {
                    status = "duck"
                    realoffset = 59
                    fakeoffset = 0
                    lbyoffset = 0
                } else {
                    if (left_distance < deviation && right_distance < deviation) {
                        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw"]) == 0) {
                            status = "jitter"
                            if (switcher == 0) {
                                realoffset = -58
                            } else if (switcher == 1) {
                                realoffset = -58
                            } else if (switcher == 2) {
                                realoffset = 58
                            } else if (switcher == 3) {
                                realoffset = 58
                            }
                            fakeoffset = 0
                            lbyoffset = 0
                        } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw"]) == 1) {
                            status = "static"
                            realoffset = 23
                            fakeoffset = 0
                            lbyoffset = 0
                        }
                    } else {
                        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw"]) == 0) {
                            status = "static"
                            realoffset = 23
                            fakeoffset = 0
                            lbyoffset = 0
                        } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Main body yaw"]) == 1) {
                            status = "jitter"
                            if (switcher == 0) {
                                realoffset = -58
                            } else if (switcher == 1) {
                                realoffset = -58
                            } else if (switcher == 2) {
                                realoffset = 58
                            } else if (switcher == 3) {
                                realoffset = 58
                            }
                            fakeoffset = 0
                            lbyoffset = 0
                        }
                    }
                }
            }
        }

        // Tick
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 3) {
            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types"]) == 0) {
                if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"]) == true) {
                    status = "negate"
                    if (tick >= 0 && tick <= 8) {
                        realoffset = 58
                    } else if (tick >= 9 && tick <= 16) {
                        realoffset = 48
                    } else if (tick >= 19) {
                        realoffset = 38
                    }
                } else {
                    if (Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount") > 0.4) {
                        status = "avoid"
                        if (switcher == 0 || switcher == 1) {
                            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) + 5);
                        } else if (switcher == 2 || switcher == 3) {
                            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) - 5);
                        }
                        if (tick == 23) {
                            realoffset = 59
                        } else {
                            realoffset = 28
                        }
                    } else {
                        if (getVelocity > 2) {
                            status = "still"
                            if (switcher == 0 || switcher == 1) {
                                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) + 1);
                            } else if (switcher == 2 || switcher == 3) {
                                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) - 1);
                            }
                            if (tick >= 12) {
                                realoffset = 1
                            } else {
                                realoffset = -1
                            }
                        } else {
                            status = "flicker"
                            if (switcher == 0 || switcher == 1) {
                                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) + 10);
                            } else if (switcher == 2 || switcher == 3) {
                                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) - 10);
                            }
                            if (tick >= 12) {
                                realoffset = 59
                            } else {
                                realoffset = -59
                            }
                        }
                    }
                }
                fakeoffset = 0;
                lbyoffset = 0;
            } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Tick types"]) == 1) {
                status = "negate"
                if (tick >= 0 && tick <= 8) {
                    realoffset = 58
                } else if (tick >= 9 && tick <= 16) {
                    realoffset = 48
                } else if (tick >= 19) {
                    realoffset = 38
                }
                fakeoffset = 0
                lbyoffset = 0
            }
        }

        // Bruteforce
        const firedshots = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_iShotsFired");
        var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
        var dsyrounded = Math.round(dsy);
        var clampeddsy = clamp(dsyrounded, -60, 60);
        var tickspassed = UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Maximum surpassed ticks"])
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 4) {

            if (firedshots > 0) {
                if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Shot inverter"])) {
                    realoffset = realoffset * -1;
                }
            }

            if (misscount >= 1) {
                status = "indexed"
                realoffset = realoffset + (misscount * 10) - (thitcount * 10)
                fakeoffset = 0
                lbyoffset = 0
            } else {
                if (lphitcount >= 1) {
                    status = "safety"
                    realoffset = 17
                    fakeoffset = 0
                    lbyoffset = 0
                } else {
                    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage"]) == 0) {
                        status = "jitter"
                        if (switcher == 0) {
                            realoffset = -59
                        } else if (switcher == 1) {
                            realoffset = -59
                        } else if (switcher == 2) {
                            realoffset = 59
                        } else if (switcher == 3) {
                            realoffset = 59
                        }
                        fakeoffset = 0
                        lbyoffset = 0
                    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage"]) == 1) {
                        if (left_distance < 600 && right_distance < 600) {
                            if (clampeddsy > 0) {
                                status = "left"
                            } else {
                                status = "right"
                            }
                        } else {
                            status = "default"
                        }
                        realoffset = 57
                        fakeoffset = 0
                        lbyoffset = 0
                    } else {
                        status = "default"
                        realoffset = 57
                        fakeoffset = 0
                        lbyoffset = 0
                    }
                }
            }

            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options"]) & (1 << 1)) {
                if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage"]) == 0) {
                    if (timelol == tickspassed) {
                        UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage"], 1);
                        timelol = 0
                    } else {
                        timelol = timelol + 1
                    }
                }
            }

            if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Reset bruteforce stages"])) {
                thitcount = 0
                lphitcount = 0
                misscount = 0
            }
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"])) {
            fakeoffset = fakeoffset * -1
            realoffset = realoffset * -1
            lbyoffset = lbyoffset * -1
        }

        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Avoid high delta"])) {
            realoffset = realoffset / 2
        }

        var local = Entity.GetLocalPlayer()
        var eye_angles = Local.GetViewAngles();
        left_distance = trace( local, [ 0, eye_angles[1] - 22] );
        right_distance = trace( local, [ 0, eye_angles[1] + 22] );
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) != 0) {
            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Adaptive freestanding"])) {
                if (left_distance < 600 && right_distance < 600) {
                    if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Unsafe freestanding"]) == true) {
                        if ( right_distance < left_distance ) {
                            fakeoffset = fakeoffset * -1
                            realoffset = realoffset * -1
                            lbyoffset = lbyoffset * -1
                        }
                    } else {
                        if ( left_distance < right_distance ) {
                            fakeoffset = fakeoffset * -1
                            realoffset = realoffset * -1
                            lbyoffset = lbyoffset * -1
                        }
                    }
                }
            }
        }
    }
}

function stage_death() {
    if (Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 4) {
            UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage"], 0);
        }
    }
}

function stage_reset() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 4) {
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Antiaim preference"]) == 4) {
            if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Automated reset options"]) & (1 << 0)) {
                UI.SetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Bruteforce stage"], 1);
                thitcount = 0
                lphitcount = 0
                misscount = 0
            }
        } else {
            thitcount = 0
            lphitcount = 0
            misscount = 0
        }
    }
}

Cheat.RegisterCallback("player_death", "stage_death")
Cheat.RegisterCallback("round_poststart", "stage_reset")

var swap = 0
function breaker() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Break prediction"]) == 1) {
        if (RandomInt(0,100) > 55) {
            if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 0 ) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 1 ) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 2 ) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 0);
            }
        } else {
            if (RandomInt(0,15) > 10) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
            } else {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
            }
        }
    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Break prediction"]) == 2) {
        if (swap == 3) {
            swap = 0
            UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
        } else {
            swap = swap + 1
            UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
        }
    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Break prediction"]) == 3) {
        if (RandomInt(0,10) > 4) {
            UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
        } else {
            UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
        }
    }
}

// Visuals + Other
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.vis", 0, 0);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Info bar preference", ["Off", "Netgraph", "Gradient"], 0);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Indicator preference", ["Off", "Primary", "Secondary", "Other", "Alternative"], 0);
UI.AddColorPicker(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Primary colour");
UI.AddColorPicker(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Secondary colour");
UI.AddColorPicker(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Alt colour");
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Conditional side arrows");
UI.AddColorPicker(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Arrows colour");
UI.AddMultiDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Display settings", ["Exploits Indicator", "Antiaim Stages", "Forces (Baim/SP)", "Fake duck", "Minimum damage override", "Doubletap", "Hide shots"], 0);

function main_indicators() {
    primary = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Primary colour"]);
    secondary = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Secondary colour"]);
    alt = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Alt colour"]);
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;
    var charge = Exploit.GetCharge()
    var calibri = Render.AddFont("Calibri", 11, 600);
    var arial = Render.AddFont("ARIALBD", 19, 600);
    var fakepos = Local.GetFakeYaw();
    var realpos = Local.GetRealYaw();
    var dsyrng = Math.min(Math.abs(realpos - fakepos) / 2, 60).toFixed(0);
    dsyrngfinal = Number(dsyrng);
    dsyrngfinal2 = dsyrngfinal * 2;
    var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
    var dsyrounded = Math.round(dsy);
    var clampeddsy = clamp(dsyrounded, -60, 60);
    var dsyrngpog = Number(clampeddsy);

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference"]) == 1) { // primary

        // grad
        if (charge < 0.2) {
            Render.GradientRect( x + -1, y + 28, dsyrngfinal, 2.8, 1, secondary, [0, 0, 0, 0]);
            Render.GradientRect( x - -1 - dsyrngfinal, y + 28, dsyrngfinal, 2.8, 1, [0, 0, 0, 0], secondary);
        } else {
            Render.GradientRect( x + -1, y + 28, dsyrngfinal, 2.8, 1, primary, [0, 0, 0, 0]);
            Render.GradientRect( x - -1 - dsyrngfinal, y + 28, dsyrngfinal, 2.8, 1, [0, 0, 0, 0], primary);
        }

        Render.String(x + -1, y + 32, 1, "MEAT YAW", [0, 0, 0, 255], calibri);
        Render.String(x + 0, y + 31, 1, "MEAT YAW", alt, calibri);

        if (dsyrngfinal >= 10) {
            Render.String(x + 5, y + 15, 0, "o", [0,0,0,255], calibri);
            Render.String(x + 6, y + 14, 0, "o", [255,255,255,255], calibri);
        } else {
            Render.String(x + 2, y + 15, 0, "o", [0,0,0,255], calibri);
            Render.String(x + 3, y + 14, 0, "o", [255,255,255,255], calibri);
        }

        Render.String(x + -1, y + 15, 1, dsyrngfinal + "", [0,0,0,255], calibri);
        Render.String(x + 0, y + 16, 1, dsyrngfinal + "", [255,255,255,255], calibri);

    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference"]) == 2) { // secondary

        if (charge < 0.2) {
            Render.GradientRect( x + -1, y + 43, dsyrngfinal, 2.8, 1, secondary, [0, 0, 0, 0]);
            Render.GradientRect( x - -1 - dsyrngfinal, y + 43, dsyrngfinal, 2.8, 1, [0, 0, 0, 0], secondary);
        } else {
            Render.GradientRect( x + -1, y + 43, dsyrngfinal, 2.8, 1, primary, [0, 0, 0, 0]);
            Render.GradientRect( x - -1 - dsyrngfinal, y + 43, dsyrngfinal, 2.8, 1, [0, 0, 0, 0], primary);
        }

        Render.String(x + -1, y + 32, 1, "MEAT YAW", [0, 0, 0, 255], calibri);
        Render.String(x + 0, y + 31, 1, "MEAT YAW", alt, calibri);

    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference"]) == 3) { // other

        if (charge < 0.2) {
            if (dsyrngpog >= 0) {
                Render.String(x + -11, y + 40, 1, "meat", secondary, calibri);
                Render.String(x + 11, y + 40, 1, "beat", [235, 235, 235, 255], calibri);
            } else {
                Render.String(x + -11, y + 40, 1, "meat", [235, 235, 235, 255], calibri);
                Render.String(x + 11, y + 40, 1, "beat", secondary, calibri);
            }
        } else {
            if (dsyrngpog >= 0) {
                Render.String(x + -11, y + 40, 1, "meat", primary, calibri);
                Render.String(x + 11, y + 40, 1, "beat", [235, 235, 235, 255], calibri);
            } else {
                Render.String(x + -11, y + 40, 1, "meat", [235, 235, 235, 255], calibri);
                Render.String(x + 11, y + 40, 1, "beat", primary, calibri);
            }
        }

    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Indicator preference"]) == 4) { // alternative

        Render.String(x - 1, y + 41, 1, "MBY", [0,0,0,155], calibri);
        Render.String(x, y + 40, 1, "MBY", alt, calibri);

        Render.GradientRect( x + -1, y + 35, dsyrngfinal * 1.5, 3, 1, primary, secondary);
        Render.GradientRect( x - -1 - dsyrngfinal * 1.5, y + 35, dsyrngfinal * 1.5, 3, 1, secondary, primary);

        if (dsyrngfinal >= 10) {
            Render.String(x + 6, y + 16, 0, "o", [0,0,0,155], calibri);
            Render.String(x + 7, y + 15, 0, "o", [255,255,255,255], calibri);
        } else {
            Render.String(x + 3, y + 16, 0, "o", [0,0,0,155], calibri);
            Render.String(x + 4, y + 15, 0, "o", [255,255,255,255], calibri);
        }
        Render.String(x - 1, y + 20, 1, dsyrngfinal + "", [0,0,0,155], calibri);
        Render.String(x, y + 19, 1, dsyrngfinal + "", [255,255,255,255], calibri);

    }
}

var h_index = 0;
function warnings() {
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;
    var calibri = Render.AddFont("smallest_pixel-7", 9, 600);
    theme = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour"]);
    r = theme[0]
    g = theme[1]
    b = theme[2]
    charge = Exploit.GetCharge();

    autopeek = UI.GetValue(["Misc.", "Keys", "Key assignment", "Auto peek"]);
    var dmg = UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick min dmg"]);
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick"])) {
        if (autopeek == true) {
            Render.String(x + -1, y - 18, 1, "IDEAL TICK (" + dmg + ")", [0,0,0,255], calibri);
            Render.String(x + 1, y - 20, 1, "IDEAL TICK (" + dmg + ")", [0,0,0,255], calibri);
            Render.String(x + 0, y - 19, 1, "IDEAL TICK (" + dmg + ")", theme, calibri);
        }
    }
}

function side() {
    var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
    var dsyrounded = Math.round(dsy);
    var clampeddsy = clamp(dsyrounded, -60, 60);
    var dsyrng = Number(clampeddsy);
    var clampeddsynoneg = clamp(dsyrounded, 0, 60);
    var dsyrngnoneg = Number(clampeddsynoneg);
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/1.9905;
    dsystate = Render.AddFont("ARIALBD", 19, 600);
    localplayer_index = Entity.GetLocalPlayer( );
    localplayer_alive = Entity.IsAlive( localplayer_index );
    theme = barColor = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Arrows colour"]);
    const lp = Entity.GetLocalPlayer();
    const lpflags = Entity.GetProp(lp, "CBasePlayer", "m_fFlags");

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Conditional side arrows"]) == true ) {
        if (lpflags != 256) {
            if (dsyrng >= 0) {
                Render.String(x - 43, y - 12, 0, "<", [0,0,0,155], dsystate );     
                Render.String(x - 43, y - 13, 0, "<", [255,255,255,255], dsystate );
                Render.String(x + 31, y - 12, 0, ">", [0,0,0,155], dsystate );  
                Render.String(x + 31, y - 13, 0, ">", theme, dsystate );
            } else {
                Render.String(x + 31, y - 12, 0, ">", [0,0,0,155], dsystate );     
                Render.String(x + 31, y - 13, 0, ">", [255,255,255,255], dsystate );
                Render.String(x - 43, y - 12, 0, "<", [0,0,0,155], dsystate ); 
                Render.String(x - 43, y - 13, 0, "<", theme, dsystate );  
            }
        }
    }
}

var ticktimer = 0
function state() {
    var index1 = 0
    var fakepos = Local.GetFakeYaw();
    var realpos = Local.GetRealYaw();
    var dsyrng = Math.min(Math.abs(realpos - fakepos) / 2, 60).toFixed(0);
    dsyrngfinal = Number(dsyrng);
    var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
    var dsyrounded = Math.round(dsy);
    var clampeddsy = clamp(dsyrounded, -60, 60);
    var dsyrng2 = Number(clampeddsy);
    var brutestage = Math.round(dsyrngfinal / 10);
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;
    var pixelated = Render.AddFont("smallest_pixel-7", 9, 600);
    var pixelated2 = Render.AddFont("smallest_pixel-7", 8, 600);
    var calibri = Render.AddFont("Calibri", 11, 600);
    var duckalpha = (Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount")) * 100
    var damage = UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Minimum damage override"]);
    charge = Exploit.GetCharge();
    var dtspeed = Math.round(charge * shift)
    theme = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour"]);
    const pulse = Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / 0.3)) % (Math.PI * 2))) * 255;

    if (ticktimer == 125) {
        ticktimer = 0
    } else {
        ticktimer = ticktimer + 1
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 1)) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Reset bruteforce stages"])) {
            Render.String(x + 1, y + 62 + (index1 * 12), 1, status + " (reset)", [0,0,0,pulse], calibri);
            Render.String(x + 0, y + 61 + (index1 * 12), 1, status + " (reset)", [255,0,0,pulse], calibri);
            index1++
        } else {
            if (misscounter >= 1) {
                Render.String(x + 1, y + 62 + (index1 * 12), 1, status + " : " + misscount, [0,0,0,155], calibri);
                Render.String(x + 0, y + 61 + (index1 * 12), 1, status + " : " + misscount, theme, calibri);
                index1++
            } else {
                Render.String(x + 1, y + 62 + (index1 * 12), 1, status + "", [0,0,0,155], calibri);
                Render.String(x + 0, y + 61 + (index1 * 12), 1, status + "", [235, 235, 235, 255], calibri);
                index1++
            }
        }
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 5)) {
        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true ) {
            if (charge > 0.8) {
                Render.String(x + 1, y + 62 + (index1 * 12), 1, "rapid [" + dtspeed + "]", [0,0,0,155], calibri);
                Render.String(x + 0, y + 61 + (index1 * 12), 1, "rapid [" + dtspeed + "]", theme, calibri);
                index1++
            } else {
                Render.String(x + 1, y + 62 + (index1 * 12), 1, "rapid [" + dtspeed + "]", [0,0,0,155], calibri);
                Render.String(x + 0, y + 61 + (index1 * 12), 1, "rapid [" + dtspeed + "]", [235,235,235,255], calibri);
                index1++
            }
        }
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 6)) {
        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Hide shots"]) == true ) {
            Render.String(x + 1, y + 62 + (index1 * 12), 1, "hide", [0,0,0,155], calibri);
            Render.String(x + 0, y + 61 + (index1 * 12), 1, "hide", theme, calibri);
            index1++
        }
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 2)) {
        if (UI.GetValue(["Rage", "General", "Key assignment", "Force body aim"]) == true ) {
            Render.String(x + 1, y + 62 + (index1 * 12), 1, "baim", [0,0,0,155], calibri);
            Render.String(x + 0, y + 61 + (index1 * 12), 1, "baim", [235, 235, 235, 255], calibri);
            index1++
        }

        if (UI.GetValue(["Rage", "General", "Key assignment", "Force safe point"]) == true ) {
            Render.String(x + 1, y + 62 + (index1 * 12), 1, "safe", [0,0,0,155], calibri);
            Render.String(x + 0, y + 61 + (index1 * 12), 1, "safe", [235, 235, 235, 255], calibri);
            index1++
        }
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 3)) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
            Render.String(x + 1, y + 62 + (index1 * 12), 1, "duck", [0,0,0,155 - duckalpha], calibri);
            Render.String(x + 0, y + 61 + (index1 * 12), 1, "duck", [235, 235, 235, 255 - duckalpha], calibri);
            index1++
        }
    }

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 4)) {
        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Minimum damage override"])) {
            Render.String(x + 1, y + 62 + (index1 * 12), 1, "dmg [" + damage + "]", [0,0,0,155], calibri);
            Render.String(x + 0, y + 61 + (index1 * 12), 1, "dmg [" + damage + "]", [235, 235, 235, 255], calibri);
            index1++
        }
    }
}

function bar() {
    var bigtxt = Render.AddFont("MriyaGrotesk", 25, 600);
    var smalltxt = Render.AddFont("MriyaGrotesk", 12, 600);
    var pixelated = Render.AddFont("smallest_pixel-7", 12, 300);
    var otusername = Cheat.GetUsername();
    var pinglol = Local.Latency();
    var pingmult = pinglol * 1000;
    var pingrounded = Math.round(pingmult);
    var chargestate = Exploit.GetCharge()
    var chargemath = chargestate * 100
    var chargefinal = Math.round(chargemath);
    var cclol = Globals.ChokedCommands();
    var pinglolnigga = Entity.GetProp(Entity.GetLocalPlayer(), 'CPlayerResource', 'm_iPing');
    theme = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour"]);
    r = theme[0]
    g = theme[1]
    b = theme[2]
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;

    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Info bar preference"]) == 1) {
        // lagcomp
        if (getVelocity() > 255) {
            Render.String(x + 0, y + 501, 1, "lagcomp", [0,0,0,255], smalltxt);
            Render.String(x + 0, y + 500, 1, "lagcomp", [105 + (cclol * 10),100,100,255], smalltxt);
        } else {
            Render.String(x + 0, y + 501, 1, "lagcomp", [0,0,0,255], smalltxt);
            Render.String(x + 0, y + 500, 1, "lagcomp", [235,235,235,255], smalltxt);
        }
        
        // velocity
        if (getVelocity() > 255) {
            Render.String(x + -60, y + 501, 1, "velocity", [0,0,0,255], smalltxt);
            Render.String(x + -60, y + 500, 1, "velocity", [235,255,0,255], smalltxt);
        } else {
            Render.String(x + -60, y + 501, 1, "velocity", [0,0,0,255], smalltxt);
            Render.String(x + -60, y + 500, 1, "velocity", [235,getVelocity(),0,255], smalltxt);
        }
        
        // ping
        Render.String(x + 50, y + 501, 1, "ping", [0,0,0,255], smalltxt);
        Render.String(x + 50, y + 500, 1, "ping", [pingrounded,255,0,255], smalltxt);
    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Info bar preference"]) == 2) {
        Render.GradientRect( x + 102 + -106, y + 490, (250) * 0.85, 50, 1, [0, 0, 0, 155], [0, 0, 0, 0]);
        Render.GradientRect( x + -110 + -106, y + 490, (250) * 0.85, 50, 1, [0, 0, 0, 0], [0, 0, 0, 155]);
        Render.String(x + 106 + -106, y + 490, 1, "MBY", theme, bigtxt);
        Render.String(x + 106 + -106, y + 517, 1, otusername, [235,235,235,255], smalltxt);
        Render.String(x + 25 + 25, y + 500, 1, pingrounded + "ms", [235,235,235,255], smalltxt);
        Render.String(x + -25 + -25, y + 500, 1, chargefinal + "%", [235,235,235,255], smalltxt);
    }
}

const timer = 0
const timer2 = 0
var text = ""
var t = 0
var alpha = 0
var alpha2 = 0
function dt_indic() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Display settings"]) & (1 << 0)) {
        var h_index = 0;
        var screensize = Render.GetScreenSize();
        var x = screensize[0]/2;
        var y = screensize[1]/2;
        var charge = Exploit.GetCharge()
        var calibri = Render.AddFont("Calibri", 11, 600);
        theme = UI.GetColor(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Theme colour"]);
    
        var text = "meatbeat [" + type + "] | tickbase: " + shift + "/" + tol + " | " + Cheat.GetUsername()
        var length = Render.TextSize(text, calibri)[0]
    
        timer2 = charge * (timer)
    
        if (shot_fired == true) {
            if (t == 255) {
                t = 0
                shot_fired = false
            } else {
                t = t + 1
            }
        }
    
        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true ) {
            if (timer == length + 4) {
                timer = (length + 4)
            } else {
                timer = timer + 1
            }
        } else {
            if (timer == 0) {
                timer = 0
            } else {
                timer = timer - 1
            }
        }

        clamp(timer,0,length + 4)
    
        Render.FilledRect(x - 750, y - 0, length + 4, 15, [0, 0, 0, 85])
        Render.FilledRect(x - 750, y - 0, length + 4, 2, [15, 15, 15, 85])
    
        //Render.FilledRect(x - 750, y - 0, timer, 2, [255, 255, 255, 155])
        Render.FilledRect(x - 750, y - 0, timer2, 2, theme)
    
        Render.String(x - 748, y - -2, 0, text + "", [255,255,255,255], calibri);
    
        if (charge > 0.7) {
            alpha = 255 - t
        } else {
            alpha = 255
        }
    
        if (charge > 0.8) {
            alpha2 = 255
        } else {
            alpha2 = 255 - t
        }
    
        if (shot_fired == true) {
            //Render.String(x - 751, y + 17 + (h_index * 10), 0, "[-] Fired DT at " + dt_target, [0,0,0,155 - t], calibri);
            Render.String(x - 750, y + 16 + (h_index * 10), 0, "[-] Fired DT at " + dt_target + " [shift: " + shift + " | tolerance: " + tol + "]", [255,255,255,alpha], calibri);
            h_index++;
        }
    
        if (charge > 0.7) {
            Render.String(x - 750, y + 16 + (h_index * 10), 0, "[+] Successfully charged " + shift + " ticks", [255,255,255,alpha], calibri);
            h_index++;
        }
    }
}

/*function firedashot() {
    if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true ) {
        var hit = Entity.GetEntityFromUserID(Event.GetInt("userid"));
        var attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
        ragebot_target = Event.GetInt("target_index");
        targetroflsauce = Entity.GetEntityFromUserID(ragebot_target);
        ragebot_target_hitbox = Event.GetInt("hitbox");
        ragebot_target_hitchance = Event.GetInt("hitchance");
        target_damage = Event.GetInt("dmg_health");
        ragebot_target_safepoint = Event.GetInt("safepoint");
        targetName = Entity.GetName(ragebot_target);
        if (attacker == Entity.GetLocalPlayer()) {
            dt_target = targetName
            shot_fired = true
        }
    }
}*/

// Misc + Other
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "meatbeat.misc", 0, 0);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Killsay", ["None", "Simple", "Cringe"], 0);
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Minimum damage override", 1, 130);
UI.AddDropdown(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Prestart autobuy", ["None", "Awp", "Scout"], 0);
UI.AddCheckbox(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], "Target warnings");

var cringe = [
    "$$UFF$$ 1tap by meat beat yaw low iq dog (◣_◢)",
    "l2p shit bot hhh raped by meat beat yaw discord.gg/k9Zhv47Bv7 ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "tapped by meat beat yaw sellix.io/Camden (◣_◢)",
    "umad? get good get meat beat yaw ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "u just got your meat beat get good get meat beat yaw ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "so shit even jace could tap you get good get meat beat yaw ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "no meat beat yaw no talk ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "see yourself get owned at discord.gg/k9Zhv47Bv7 (◣_◢)",
    "unfortunately we dont sell brains (◣_◢)",
];

var simplehs = [
    "headshot",
    "hs",
]

var simpleother = [
    "ns",
    "nice.",
    "good one",
    "onetap",
    "iq?",
]

function getRandomArrayElement(arr){  // randomizing messages
    var min = 0;
    var max = (arr.length - 1);
    var randIndex = Math.floor(Math.random() * (max - min)) + min;
    return arr[randIndex];
}

function killsay() {
    if (Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Killsay"]) == 2) {
            Cheat.ExecuteCommand("say " + getRandomArrayElement(cringe));
        } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Killsay"]) == 1) {
            if (Event.GetInt("headshot")) {
                Cheat.ExecuteCommand("say " + getRandomArrayElement(simplehs));
            } else {
                Cheat.ExecuteCommand("say " + getRandomArrayElement(simpleother));
            }
        }
    }
}

function overhead_warnings() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Target warnings"])) {
        const enemies = Entity.GetEnemies()
        for (i in enemies) {
            if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true ) {
                if (UI.GetValue(["Misc.", "Keys", "Key assignment", "Auto peek"]) == true && UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Ideal tick"]) == true) {
                    brainhelper(enemies[i], 2)
                } else {
                    brainhelper(enemies[i], 1)
                }
            } else {
                brainhelper(enemies[i], 0)
            }
        }
    }
}

function brainhelper(player, a) {
    if (!Entity.IsValid(player) || !Entity.IsAlive(player))
    return;

    const box = Entity.GetRenderBox(player)
    var charge = Exploit.GetCharge();
    var chargemult = charge * 100;

    if (box[1] == null )
    return;

    x_center = box[1] / 2 + box[3] / 2

    var smalltxt = Render.AddFont("smallest_pixel-7", 9, 600);
    if (a == 0) {
        Render.String(x_center + 0.5 + 1, box[2] - 20 + 0.5, 1, "default", [0,0,0,255], smalltxt);
        Render.String(x_center + 0.5 - 1, box[2] - 18 + 0.5, 1, "default", [0,0,0,255], smalltxt);
        Render.String(x_center + 0.5, box[2] - 19 + 0.5, 1, "default", [235,235,235,255], smalltxt);
    } else if (a == 1) {
        Render.String(x_center + 0.5 + 1, box[2] - 20 + 0.5, 1, "x2", [0,0,0,255], smalltxt);
        Render.String(x_center + 0.5 - 1, box[2] - 18 + 0.5, 1, "x2", [0,0,0,255], smalltxt);
        Render.String(x_center + 0.5, box[2] - 19 + 0.5, 1, "x2", [235 - chargemult,235,235 - chargemult,255], smalltxt);
    } else if (a == 2) {
        Render.String(x_center + 0.5 + 1, box[2] - 20 + 0.5, 1, "tick", [0,0,0,255], smalltxt);
        Render.String(x_center + 0.5 - 1, box[2] - 18 + 0.5, 1, "tick", [0,0,0,255], smalltxt);
        Render.String(x_center + 0.5, box[2] - 19 + 0.5, 1, "tick", [135 + chargemult,100,100,255], smalltxt);
    }
}

function autobuy() {
    if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Prestart autobuy"]) == 1) {
        Cheat.ExecuteCommand("buy awp");
        Cheat.ExecuteCommand("buy awp");
        Cheat.ExecuteCommand("buy awp");
        Cheat.ExecuteCommand("buy awp");
        Cheat.ExecuteCommand("buy awp");
    } else if (UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Prestart autobuy"]) == 2) {
        Cheat.ExecuteCommand("buy ssg08");
        Cheat.ExecuteCommand("buy ssg08");
        Cheat.ExecuteCommand("buy ssg08");
        Cheat.ExecuteCommand("buy ssg08");
        Cheat.ExecuteCommand("buy ssg08");
    }
}

function damage_override() {
    var damage = UI.GetValue(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw", "Minimum damage override"]);
    if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Minimum damage override"])) {
        const enemies = Entity.GetEnemies()
        for (i in enemies) {
            Ragebot.ForceTargetMinimumDamage(enemies[i], damage)
        }
    }
}

// Hotkeys + Other
UI.AddHotkey(["Rage", "Anti Aim", "General", "Key assignment"], "Minimum damage override", "Minimum damage override");
UI.AddHotkey(["Rage", "Anti Aim", "General", "Key assignment"], "Unsafe freestanding", "Unsafe freestanding");
UI.AddHotkey(["Rage", "Anti Aim", "General", "Key assignment"], "Reset bruteforce stages", "Reset bruteforce stages");
UI.AddSliderInt(["Rage", "meatbeat.yaw", "SHEET_MGR", "meatbeat.yaw"], " ", 0, 0); // end line

// Callbacks + Other
function create_move() {
    safepeek();
    idealtick();
    accuracy();
    breaker();
    override();
    predict_doubletap_damage();
    damage_override();
}

function draw() {
    main_indicators();
    overhead_warnings();
    //settings();
    navigation();
    bar();
    state();
    side();
    warnings();
    dt_indic();
}

Cheat.RegisterCallback("CreateMove", "create_move")
Cheat.RegisterCallback("Draw", "draw")

Cheat.RegisterCallback("ragebot_fire", "fire")
//Cheat.RegisterCallback("ragebot_fire", "firedashot")

Cheat.RegisterCallback("player_death", "killsay")

Cheat.RegisterCallback("round_prestart", "autobuy")