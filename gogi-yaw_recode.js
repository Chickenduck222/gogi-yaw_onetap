/*
    [gogi-yaw]
    Authors:
    - Camden
*/

var gogi = {
    build : "debug",
    ver : "2.0.1",
}

/*
    Script:
    - Menu
*/

const path = ["Rage", "[gogi-yaw]", "SHEET_MGR", "[gogi-yaw]"] // subtab ref
const hk_path = ["Rage", "General", "General", "Key assignment"] // hotkeys ref

UI.AddSubTab(["Rage", "SUBTAB_MGR"], "[gogi-yaw]") // subtab

const master_switch = UI.AddCheckbox(path, "Masterswitch"); // script ms

const doubletap_header = UI.AddSliderInt(path, "[gogi-yaw] doubletap", 0, 0); // header
const doubletap_ovr = UI.AddCheckbox(path, "Doubletap"); // antiaim override
const doubletap_options = UI.AddMultiDropdown(path, "Doubletap options", ["Adjust tickbase", "Instant", "Control clock correction"], 0);
const anti_aim_header = UI.AddSliderInt(path, "[gogi-yaw] anti-aim", 0, 0); // header
const anti_aim = UI.AddCheckbox(path, "Anti-aim"); // antiaim override
const anti_aim_opts = UI.AddMultiDropdown(path, "Anti-aim options", ["Jitter conditions", "Dynamic fake-yaw", "Avoid high delta", "Legit anti-aim on use"], 0);
const anti_aim_jitter = UI.AddMultiDropdown(path, "Jitter conditions", ["Dormant", "Until vulnerable", "When vulnerable", "On miss"], 0);
const anti_aim_freestand = UI.AddDropdown(path, "Freestanding", ["Normal", "Reversed", "Predictive"], 0);
const visuals_header = UI.AddSliderInt(path, "[gogi-yaw] visuals", 0, 0); // header
const visuals_ovr = UI.AddCheckbox(path, "Visuals"); // visuals override
const visuals_style = UI.AddDropdown(path, "Indication style", ["-", "#1", "#2"], 0);
const visuals_addons = UI.AddMultiDropdown(path, "Visual addons", ["Watermark", "Keybinds", "Debug", "Doubletap"], 0);
var visuals_accent = UI.AddColorPicker(path, "Accent colour")
const misc_header = UI.AddSliderInt(path, "[gogi-yaw] miscellaneous", 0, 0); // header
const misc_ovr = UI.AddCheckbox(path, "Miscellaneous"); // visuals override
const misc_features = UI.AddMultiDropdown(path, "Miscellaneous options", ["Break feet yaw", "Killsay"], 0);

/*
    Script:
    - Modules
*/

var vars = {
    // storage.
    status : "default",

    // player-based.
    target : undefined,
    fov : 180,
    phase : undefined,

    // on-miss.
    info : [],
    miss : Globals.Curtime(),

    // fractions.
    lby_fraction : undefined,
    radius_fraction : undefined,

    // freestanding.
    hit_side : 1,

    fs_data : [],
    fs_side : undefined,

    // anti-bruteforce.
    bf_side : 1,
    bf_timer : Globals.Curtime(),

    // vulnerability.
    vulnerable : false,
    vulner_time : Globals.Curtime(),
}

/*
    Script:
    - Helpers
*/

Render.AddFont = function( name, size, weight ) {
    return Render.GetFont( name.concat( ".ttf" ), size, true ) 
}

function dtr(a) {
    return a / 180 * Math.PI
}

function rtd(a) {
    return a * 180 / Math.PI
}

function can_doubletap() {
    if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == false)
    return;

    if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"]))
    return;

    var me = Entity.GetLocalPlayer()

    if (Entity.IsAlive(me) == false)
    return;

    var next_attack = Entity.GetProp(me, "CCSPlayer", "m_flNextAttack") + 0.25
    var next_primary_attack = Entity.GetProp(me, "DT_BaseCombatWeapon", "m_flNextPrimaryAttack") + 0.5

    if (next_attack == 0 || next_primary_attack == 0)
    return;

    return (next_attack - Globals.Curtime() < 0) && (next_primary_attack - Globals.Curtime() < 0)
}

function clamp(value, min, max) {
    if (value > max)
        return max
    if (value < min)
        return min
    return value
}

function get_velocity(player) {
	var x,y,z = Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]" );
	if (x == 0) { 
        return end
    }
	return Math.sqrt(x*x + y*y + z*z)
}

function angle_to_vec( pitch, yaw ) {
    var p = dtr( pitch );
    var y = dtr( yaw )
    var sin_p = Math.sin( p );
    var cos_p = Math.cos( p );
    var sin_y = Math.sin( y );
    var cos_y = Math.cos( y );
    return [ cos_p * cos_y, cos_p * sin_y, -sin_p ];
}

function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function ExtendVector(vector, angle, extension) {
    var radianAngle = radian(angle);
    return [extension * Math.cos(radianAngle) + vector[0], extension * Math.sin(radianAngle) + vector[1], vector[2]];
}

function VectorAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function VectorSubtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function VectorMultiply(a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function VectorLength(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
}

function VectorNormalize(vec) {
    var length = VectorLength(vec[0], vec[1], vec[2]);
    return [vec[0] / length, vec[1] / length, vec[2] / length];
}

function VectorDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function VectorDistance(a, b) {
    return VectorLength(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function ClosestPointOnRay(target, rayStart, rayEnd) {
    var to = VectorSubtract(target, rayStart);
    var dir = VectorSubtract(rayEnd, rayStart);
    var length = VectorLength(dir[0], dir[1], dir[2]);
    dir = VectorNormalize(dir);

    var rangeAlong = VectorDot(dir, to);
    if (rangeAlong < 0.0) {
        return rayStart;
    }
    if (rangeAlong > length) {
        return rayEnd;
    }
    return VectorAdd(rayStart, VectorMultiply(dir, [rangeAlong, rangeAlong, rangeAlong]));
}

function trace( entity_id, entity_angles ) {
    var entity_vec = angle_to_vec( entity_angles[0], entity_angles[1] );
    var entity_pos = Entity.GetRenderOrigin( entity_id );
    entity_pos[2] += 50;
    var stop = [ entity_pos[ 0 ] + entity_vec[0] * 8192, entity_pos[1] + entity_vec[1] * 8192, ( entity_pos[2] )  + entity_vec[2] * 8192 ];
    var traceResult = Trace.Line( entity_id, entity_pos, stop );
    if( traceResult[1] == 1 )
        return;
    stop = [ entity_pos[ 0 ] + entity_vec[0] * traceResult[1] * 8192, entity_pos[1] + entity_vec[1] * traceResult[1] * 8192, entity_pos[2] + entity_vec[2] * traceResult[1] * 8192 ];
    var distance = Math.sqrt( ( entity_pos[0] - stop[0] ) * ( entity_pos[0] - stop[0] ) + ( entity_pos[1] - stop[1] ) * ( entity_pos[1] - stop[1] ) + ( entity_pos[2] - stop[2] ) * ( entity_pos[2] - stop[2] ) );
    entity_pos = Render.WorldToScreen( entity_pos );
    stop = Render.WorldToScreen( stop );
    if( stop[2] != 1 || entity_pos[2] != 1 )
        return;

    return distance;
}

function angle_on_screen(x ,y) {
    if (x == 0 && y == 0) {
        return 0
    }

    return rtd(Math.atan2(y,x))
}

function normalise_angle(yaw) {
    if (yaw > 180) {
        yaw = yaw -360
    } else if (yaw < -180) {
        yaw = yaw + 360
    }
    return yaw
}

function get_best_enemy() {

    vars.target = undefined

    var me = Entity.GetLocalPlayer();
    var enemies = Entity.GetEnemies()
    vars.fov = 180

    var l = Entity.GetEyePosition(me)
    var lx = l[0]
    var ly = l[1]
    var lz = l[2]
    var view = Local.GetCameraAngles()
    var view_x = view[0]
    var view_y = view[1]
    var roll = view[2]

    for (i in enemies) {
        if (Entity.IsValid(enemies[i]) == true && Entity.IsAlive(enemies[i]) == true && Entity.IsDormant(enemies[i]) == false) {
            var cur = Entity.GetProp(enemies[i], "CBaseEntity", "m_vecOrigin")
            var cur_x = cur[0]
            var cur_y = cur[1]
            var cur_z = cur[2]
            var cur_fov = Math.abs(normalise_angle(angle_on_screen(lx - cur_x, ly - cur_y) - view_y + 180))
    
            if (cur_fov < vars.fov) {
                vars.fov = cur_fov
                vars.target = enemies[i]
            }
        }
    }
}

Render.Arc = function(x, y, r1, r2, s, d, col) {
    for (var i = s; i < s + d; i++) {
        const rad = i * Math.PI / 180;

        Render.Line(x + Math.cos(rad) * r1, y + Math.sin(rad) * r1, x + Math.cos(rad) * r2, y + Math.sin(rad) * r2, col);
    }
}

Render.OutlinedString = function(x,y,centered,text,color,font,double_shadow) {
    Render.String(x+1, y+1, centered, text, [0,0,0,255], font)
    Render.String(x+1, y-1, centered, text, [0,0,0,255], font)
    Render.String(x+1, y, centered, text, [0,0,0,255], font)
    Render.String(x-1, y+1,centered, text, [0,0,0,255], font)
    Render.String(x-1, y-1,centered, text, [0,0,0,255], font)
    Render.String(x-1, y,centered, text, [0,0,0,255], font)
    Render.String(x, y+1, centered, text, [0,0,0,255], font)
    Render.String(x, y-1, centered, text, [0,0,0,255], font)
    if (double_shadow) {
        Render.String(x+1, y+2, centered, text, [0,0,0,255], font)
        Render.String(x-1, y+2,centered, text, [0,0,0,255], font)
        Render.String(x, y+2,centered, text, [0,0,0,255], font)
    }

    Render.String(x, y, centered, text, color, font)
}

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
    
    if (dist <= 125) {
        vars.info[vars.target] = dist
        vars.miss = Globals.Curtime() + 4
        vars.radius_fraction = dist / 125
        vars.bf_side = vars.bf_side * -1
    }
}
Cheat.RegisterCallback("bullet_impact", "misscounter")

function calc_angle(enemy_x, enemy_y, local_x, local_y) {
    var ydelta = local_y - enemy_y
	var xdelta = local_x - enemy_x
	var relativeyaw = Math.atan(ydelta / xdelta)
	relativeyaw = normalise_angle( relativeyaw * 180 / Math.PI )
	if (xdelta >= 0) {
		relativeyaw = normalise_angle(relativeyaw + 180)
    }
	return relativeyaw
}

function get_damage(me,enemy,x,y,z,ticks) {
    // Create 3 tables to contain x, y, and z offsets.
    var mx = []
    var my = []
    var mz = []

    // Tamper with the inputted offsets and assign them a position in the previously defined tables.
    var e_h =  Entity.GetHitboxPosition(enemy, 1);

    // Default X,Y,Z
    mx[1] = e_h[0]
    my[1] = e_h[1]
    mz[1] = e_h[2]

    // Extrapolated X
    mx[2] = e_h[0] + ticks
    my[2] = e_h[1]
    mz[2] = e_h[2]

    mx[3] = e_h[0] - ticks
    my[3] = e_h[1]
    mz[3] = e_h[2]

    // Extrapolated Y
    mx[4] = e_h[0]
    my[4] = e_h[1] + ticks
    mz[4] = e_h[2]

    mx[5] = e_h[0]
    my[5] = e_h[1] - ticks
    mz[5] = e_h[2]

    // Extrapolated Z
    mx[6] = e_h[0]
    my[6] = e_h[1]
    mz[6] = e_h[2] + ticks

    mx[7] = e_h[0]
    my[7] = e_h[1]
    mz[7] = e_h[2] - ticks

    // Loop through previously defined tables.
    for (var i=1; i <= mz.length; i++) {
        // Define a damage variable for later comparisions.
        var damage = 0

        var b_hb = []
        b_hb[0] = mx[i]
        b_hb[1] = my[i]
        b_hb[2] = mz[i]

        var e_hb = []
        e_hb[0] = x
        e_hb[1] = y
        e_hb[2] = z

        // Simplistic trace.bullet to get approximate damage that can be dealt.
        var tracing = Trace.Bullet(enemy, me, b_hb, e_hb)

        // Trace damage is over previously defined damage then update said damage variable.
        if (tracing[1] > damage) {
            damage = tracing[1]
        }

        // Return approximate damage.
        return damage
    }
}

function trace( entity_id, entity_angles ) {
    var entity_vec = angle_to_vec( entity_angles[0], entity_angles[1] );
    var entity_pos = Entity.GetRenderOrigin( entity_id );
    entity_pos[2] += 50;
    var stop = [ entity_pos[ 0 ] + entity_vec[0] * 8192, entity_pos[1] + entity_vec[1] * 8192, ( entity_pos[2] )  + entity_vec[2] * 8192 ];
    var traceResult = Trace.Line( entity_id, entity_pos, stop );
    if( traceResult[1] == 1 )
        return;
    stop = [ entity_pos[ 0 ] + entity_vec[0] * traceResult[1] * 8192, entity_pos[1] + entity_vec[1] * traceResult[1] * 8192, entity_pos[2] + entity_vec[2] * traceResult[1] * 8192 ];
    var distance = Math.sqrt( ( entity_pos[0] - stop[0] ) * ( entity_pos[0] - stop[0] ) + ( entity_pos[1] - stop[1] ) * ( entity_pos[1] - stop[1] ) + ( entity_pos[2] - stop[2] ) * ( entity_pos[2] - stop[2] ) );
    entity_pos = Render.WorldToScreen( entity_pos );
    stop = Render.WorldToScreen( stop );
    if( stop[2] != 1 || entity_pos[2] != 1 )
        return;

    return distance;
}

function make_dsy(x) {
    var x_length = toString(x).length
    var divis_factor = x_length - 1
  
    var divis_val = 1
  
    for (var i=2; i < divis_factor; i++) {
        divis_val = divis_val * 10
    }
  
    var val_one = x / divis_val
  
    if (val_one > 60) {
        return val_one / 2
    } else {
        return val_one
    }
}

function make_byaw(x) {
    var x_length = toString(x).length
    var divis_factor = x_length - 2
  
    var divis_val = 1
  
    for (var i=2; i < divis_factor; i++) {
        divis_val = divis_val * 10
    }
  
    var val_one = x / divis_val
  
    if (val_one > 360) {
        return normalise_angle(val_one / 2)
    } else {
        return normalise_angle(val_one)
    }
    
}

/*
    Script:
    - Doubletap
*/
var dt_shift = 14
var dt_tol = 0
var dt_cc = 1
var dt_mupc = 16
function handle_doubletap() {
    if (UI.GetValue(master_switch) == false)
    return;

    if (UI.GetValue(doubletap_ovr) == false)
    return;

    var me = Entity.GetLocalPlayer()

    var left_trace = trace(me, [0, Local.GetViewAngles()[1] + 90])
    var right_trace = trace(me, [0, Local.GetViewAngles()[1] - 90])

    if (UI.GetValue(doubletap_options) & (1 << 0)) {
        if ((Local.Latency() * 1000) > 80 || right_trace > 5000) {
            dt_shift = 14
        } else if (left_trace > 3000 || vars.miss > Globals.Curtime()) {
            dt_shift = 15
        } else {
            dt_shift = 16
        }
    }

    if (UI.GetValue(doubletap_options) & (1 << 1)) {
        dt_tol = 0
    } else {
        if (left_trace > right_trace) {
            dt_tol = 0
        } else {
            dt_tol = clamp(dt_shift - 14,0,2)
        }
    }

    dt_mupc = dt_shift + 2

    if (UI.GetValue(doubletap_options) & (1 << 2)) {
        if (dt_shift > 16 || (Local.Latency() * 1000) > 100) {
            dt_cc = 0
        } else {
            dt_cc = 1
        }
    }

    Exploit.OverrideTolerance(dt_tol)
    Exploit.OverrideShift(dt_shift)
    Exploit.OverrideMaxProcessTicks(dt_mupc)
    Convar.SetInt("cl_clock_correction", dt_cc)
}

/*
    Script:
    - Anti-aim
*/
var fakeoffset = 0
var realoffset = 0
var lbyoffset = 0
var swap = 0
var delta_save = 0
var wall_dist = 0
function antiaim() {
    if (UI.GetValue(anti_aim) == false)
    return;

    if (UI.GetValue(master_switch) == false)
    return;

    swap > 2 ? (swap = 0) : swap++

    var me = Entity.GetLocalPlayer()

    if (vars.target != undefined) {
        var l = Entity.GetEyePosition(me)
        var lx = l[0]
        var ly = l[1]
        var lz = l[2]
        var view = Local.GetCameraAngles()
        var view_x = view[0]
        var view_y = view[1]
        var roll = view[2]
        var eq = Entity.GetHitboxPosition(vars.target, 0);
        var e_x = eq[0]
        var e_y = eq[1]
        var e_z = eq[2]
        
        var yaw = calc_angle(lx, ly, e_x, e_y)
        var rdir = angle_to_vec(0, (yaw + 90))
        var rdir_x = rdir[0]
        var rdir_y = rdir[1]
        var rdir_z = rdir[2]
        var rend_x = lx + rdir_x * 10
        var rend_y = ly + rdir_y * 10
    
        var ldir = angle_to_vec(0, (yaw - 90))
        var ldir_x = ldir[0]
        var ldir_y = ldir[1]
        var ldir_z = ldir[2]
        var lend_x = lx + ldir_x * 10
        var lend_y = ly + ldir_y * 10
    
        var yaw = calc_angle(lx, ly, e_x, e_y)
        var rdir_two = angle_to_vec(0, (yaw + 90))
        var rdir_x_two = rdir_two[0]
        var rdir_y_two = rdir_two[1]
        var rdir_z_two = rdir_two[2]
        var rend_x_two = lx + rdir_x_two * 100
        var rend_y_two = ly + rdir_y_two * 100
    
        var ldir_two = angle_to_vec(0, (yaw - 90))
        var ldir_x_two = ldir_two[0]
        var ldir_y_two = ldir_two[1]
        var ldir_z_two = ldir_two[2]
        var lend_x_two = lx + ldir_x_two * 100
        var lend_y_two = ly + ldir_y_two * 100
    
        var left_trace = get_damage(me, vars.target, rend_x, rend_y, lz, 40)
        var right_trace = get_damage(me, vars.target, lend_x, lend_y, lz, 40)
        var left_trace_two = get_damage(me, vars.target, rend_x_two, rend_y_two, lz, 40)
        var right_trace_two = get_damage(me, vars.target, lend_x_two, lend_y_two, lz, 40)
    
        if (left_trace > 0 || left_trace_two > 0 || right_trace > 0 || right_trace_two > 0) {
            if (left_trace > right_trace || left_trace_two > right_trace_two) {
                vars.hit_side = -1
                delta_save = Math.max(left_trace, left_trace_two)
            } else {
                vars.hit_side = 1
                delta_save = Math.max(right_trace, right_trace_two)
            }
            vars.vulner_time = Globals.Curtime() + 4
        }
    
        if (vars.vulner_time > Globals.Curtime()) {
            vars.vulnerable = true
        } else {
            vars.vulnerable = false
        }
    } else {
        vars.vulnerable = false
    }

    wall_dist = trace(me, [0, Local.GetViewAngles()[1]]);

    vars.lby_fraction = (Entity.GetProp(me, "DT_CSPlayer", "m_flLowerBodyYawTarget") / 180)

    var use_miss = vars.radius_fraction != undefined ? true : false

    if ((UI.GetValue(misc_features) & (1 << 1)) && (UI.GetValue(misc_ovr))) {
        UI.SetValue(["Misc.", "Movement", "Movement", "Leg movement"], swap)
    }

    AntiAim.SetOverride(1);
    AntiAim.SetRealOffset(realoffset);
    AntiAim.SetFakeOffset(fakeoffset);
    AntiAim.SetLBYOffset(lbyoffset);

    if (vars.target == undefined) {
        // dormant
        vars.status = "dormant"
        if ((UI.GetValue(anti_aim_opts) & (1 << 0)) && (UI.GetValue(anti_aim_jitter) & (1 << 0))) {
            realoffset = swap > 0.5 ? 57 : -57
            fakeoffset = 0
            lbyoffset = 0
        } else {
            realoffset = swap > 0.5 ?  48 : 57
            fakeoffset = 0
            lbyoffset = Math.round(make_byaw(wall_dist))
        }
    } else {
        if ((UI.GetValue(anti_aim_opts) & (1 << 0))) {
            if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"])) {
                vars.status = "safe"
                realoffset = clamp(Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / 0.3)) % (Math.PI * 2))) * 23, 17, 24)
                fakeoffset = -Math.round(3 * vars.lby_fraction)
                lbyoffset = 0
            } else if (use_miss == true && vars.miss > Globals.Curtime()) {
                vars.status = "indexed"
                realoffset = (57 * vars.radius_fraction)
                fakeoffset = Math.round(3 * vars.lby_fraction)
                lbyoffset = 0
            } else if (vars.vulnerable == true) {
                if (use_miss == true) {
                    vars.status = "dodge^"
                    if (left_trace > right_trace || left_trace_two > right_trace_two) {
                        realoffset = clamp(delta_save * vars.radius_fraction,0, 57)
                        fakeoffset = Math.round(5 * vars.lby_fraction)
                        lbyoffset = 0
                    } else {
                        realoffset = clamp(delta_save * vars.radius_fraction,0, 57)
                        fakeoffset = Math.round((3 * vars.lby_fraction) * -1)
                        lbyoffset = 0
                    }
                } else {
                    vars.status = "force"
                    realoffset = 17
                    fakeoffset = swap > 1 ? -5 : 5
                    lbyoffset = 0
                }
            } else if (use_miss == true) {
                vars.status = "dynamic+"
                realoffset = RandomInt((57 * vars.radius_fraction),(57 * vars.radius_fraction) * vars.lby_fraction)
                fakeoffset = 4
                lbyoffset = 0
            } else {
                vars.status = "dynamic"
                if (Math.round(make_dsy(wall_dist)) > 10) {
                    realoffset = Math.round(make_dsy(wall_dist))
                    fakeoffset = swap > 1 ? 5 : -5
                    lbyoffset = Math.round(make_byaw(wall_dist))
                } else {
                    realoffset = RandomInt(45,55)
                    fakeoffset = swap > 1 ? Math.round((5 * vars.lby_fraction)) : Math.round((-5 * vars.lby_fraction))
                    lbyoffset = 0
                }
            }
        } else {
            realoffset = 57
        }

        if (((UI.GetValue(anti_aim_opts) & (1 << 0)) && (UI.GetValue(anti_aim_jitter) & (1 << 1)) && vars.vulnerable == false)
         || ((UI.GetValue(anti_aim_opts) & (1 << 0)) && (UI.GetValue(anti_aim_jitter) & (1 << 2)) && vars.vulnerable == true)
         || ((UI.GetValue(anti_aim_opts) & (1 << 0)) && (UI.GetValue(anti_aim_jitter) & (1 << 3)) && vars.miss > Globals.Curtime())) {
            vars.status = "jitter"
            realoffset *= swap > 0.5 ? 1 : -1
            lbyoffset *= swap > 0.5 ? 1 : -1
        }
    }

    realoffset *= vars.hit_side

    if (UI.GetValue(anti_aim_freestand) == 1) {
        realoffset *= -1
        lbyoffset *= -1
    } else if (UI.GetValue(anti_aim_freestand) == 1) {
        realoffset *= (vars.hit_side * -1)
        lbyoffset *= (vars.hit_side * -1)
    }

    if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA direction inverter"])) {
        realoffset *= -1
        lbyoffset *= -1
    }

    if (Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_iShotsFired") > 0) {
        realoffset *= -1
        lbyoffset *= -1
        vars.bf_side *= -1
        vars.bf_timer = Globals.Curtime() + 3
    }
}

/*
    Script:
    - Visuals
*/
function visuals() {
    var me = Entity.GetLocalPlayer()
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;
    var charge = Exploit.GetCharge()
    var calibri = Render.AddFont("Calibri", 11, 600);
    var smallercalibri = Render.AddFont("Calibri", 9, 600);
    var boldcalibri = Render.AddFont("CALIBRIB", 11, 600);
    var verdana = Render.AddFont("Verdana", 11, 600);
    var sp7 = Render.AddFont("smallest_pixel-7", 9, 600);
    var boldarial = Render.AddFont("ARIALBD", 19, 600);
    var accent = UI.GetColor(visuals_accent)
    //var colour_two = UI.GetColor(vis_colour_two)
    //var colour_three = UI.GetColor(vis_colour_thr)
    var dt_state = charge * 255
    var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
    var dsyrounded = Math.round(dsy);
    var clampeddsy = clamp(dsyrounded, -60, 60);
    var dsyrng = Math.min(Math.abs(Local.GetRealYaw() - Local.GetFakeYaw()) / 2, 60).toFixed(0);
    var pulse = Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / 0.3)) % (Math.PI * 2))) * 255;
    var choke = Globals.ChokedCommands()
    var h_index = 0

    if (UI.GetValue(visuals_ovr) == false)
    return;

    var aa_side = clampeddsy > 0 ? -1 : 1
    var target_name = vars.target == undefined ? "unknown" : Entity.GetName(vars.target)

    if (Entity.IsAlive(me) == false)
    return;

    // Render.OutlinedString(x - 750, y + (h_index * 12), 0, "gogi-yaw.js - version " + gogi.ver, [255,255,255,255], boldcalibri, true);
    // h_index++;

    // Render.OutlinedString(x - 750, y + (h_index * 12), 0, "> anti-aim info: side = " + aa_side + " (" + (Math.abs(Math.round(vars.miss - Globals.Curtime()))) + "s, " + (Math.abs(Math.round(vars.vulner_time - Globals.Curtime()))) + "s," + Math.round(wall_dist) + "units) target: " + target_name, [155,155,255,255], boldcalibri, true);
    // h_index++;

    // if (vars.bf_timer > Globals.Curtime()) {
    //     Render.OutlinedString(x - 750, y + (h_index * 12), 0, "     > brute phase: side = " + vars.bf_side, [255,155,155,pulse], boldcalibri, true);
    //     h_index++;
    // }

    // if (vars.miss > Globals.Curtime()) {
    //     Render.OutlinedString(x - 750, y + (h_index * 12), 0, "     > updated index: radius: = " + (vars.radius_fraction * 125), [255,155,155,pulse], boldcalibri, true);
    //     h_index++;
    // }

    // Render.OutlinedString(x - 750, y + (h_index * 12), 0, "> player info: state = " + vars.status + " (real: " + realoffset + " | fake: " + fakeoffset + " | lby: " + lbyoffset + ")", [155,255,155,255], boldcalibri, true);
    // h_index++;

    if (UI.GetValue(visuals_addons) & (1 << 0)) {
        var wm_size = Render.TextSize("gogi-yaw.js - version " + gogi.ver, boldcalibri)
        Render.FilledRect(x + (screensize[0] / 2) - 130, y - (screensize[1] / 2) + 10, wm_size[0] + 10, 15, [0, 0, 0, 200])
        Render.FilledRect(x + (screensize[0] / 2) - 130, y - (screensize[1] / 2) + 25, wm_size[0] + 10, 2, accent)
        Render.OutlinedString(x + (screensize[0] / 2) - 127, y - (screensize[1] / 2) + 11, 0, "gogi-yaw.js - version " + gogi.ver, [255,255,255,255], boldcalibri, true);
    }

    if (UI.GetValue(visuals_addons) & (1 << 1)) {
        var wm_size = Render.TextSize("gogi-yaw.js - keybinds", boldcalibri)
        Render.FilledRect(x - (screensize[0] / 2) + 20, y - (screensize[1] / 2) + 510, wm_size[0] + 20, 15, [0, 0, 0, 200])
        Render.FilledRect(x - (screensize[0] / 2) + 20, y - (screensize[1] / 2) + 525, wm_size[0] + 20, 2, accent)
        Render.OutlinedString(x - (screensize[0] / 2) + 28, y - (screensize[1] / 2) + 511, 0, "gogi-yaw.js - keybinds", [255,255,255,255], boldcalibri, true);
        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"])) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530, 0, "| double-tap", [255,255,255,255], boldcalibri, true);
            h_index++;

            if (can_doubletap() == false || Exploit.GetCharge() < 0.7) {
                Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530 + (h_index * 11), 0, "    charging", [255,0 + (Exploit.GetCharge() * 255),0 + (Exploit.GetCharge() * 255),255], boldcalibri, true);
                h_index++;
            }
        }

        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Hide shots"])) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530 + (h_index * 11), 0, "| hide shots", [255,255,255,255], boldcalibri, true);
            h_index++;
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Fake duck"])) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530 + (h_index * 11), 0, "| fakeduck", [255,255,255,255], boldcalibri, true);
            h_index++;
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA direction inverter"])) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530 + (h_index * 11), 0, "| inverter", [255,255,255,255], boldcalibri, true);
            h_index++;
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "Slow walk"])) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530 + (h_index * 11), 0, "| slowmotion", [255,255,255,255], boldcalibri, true);
            h_index++;
        }

        if (UI.GetValue(["Rage", "General", "General", "Key assignment", "Damage override"])) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, y - (screensize[1] / 2) + 530 + (h_index * 11), 0, "| damage override", [255,255,255,255], boldcalibri, true);
            h_index++;
        }
    }

    var debug_y = (y - (screensize[1] / 2) + 530 + (h_index * 11))
    var d_index = 0

    if (UI.GetValue(visuals_addons) & (1 << 2)) {
        var wm_size = Render.TextSize("gogi-yaw.js - debug", boldcalibri)
        Render.FilledRect(x - (screensize[0] / 2) + 20, debug_y + 10, wm_size[0] + 20, 15, [0, 0, 0, 200])
        Render.FilledRect(x - (screensize[0] / 2) + 20, debug_y + 25, wm_size[0] + 20, 2, accent)
        Render.OutlinedString(x - (screensize[0] / 2) + 28, debug_y + 11, 0, "gogi-yaw.js - debug", [255,255,255,255], boldcalibri, true);

        // anti-aim status
        Render.OutlinedString(x - (screensize[0] / 2) + 21, debug_y + 30, 0, "| anti-aim", [255,255,255,255], boldcalibri, true);
        d_index++;

        Render.OutlinedString(x - (screensize[0] / 2) + 21, debug_y + 30 + (d_index * 11), 0, "    status: " + vars.status, [255,255,255,255], boldcalibri, true);
        d_index++;

        Render.OutlinedString(x - (screensize[0] / 2) + 21, debug_y + 30 + (d_index * 11), 0, "    target: " + target_name, [255,255,255,255], boldcalibri, true);
        d_index++;

        if (vars.bf_timer > Globals.Curtime()) {
            Render.OutlinedString(x - (screensize[0] / 2) + 21, debug_y + 30 + (d_index * 11), 0, "    anti-brute: side = " + vars.bf_side, [255,255,255,255], boldcalibri, true);
            d_index++;
        }

        // anti-aim status
        Render.OutlinedString(x - (screensize[0] / 2) + 21, debug_y + 30 + (d_index * 11), 0, "| doubletap", [255,255,255,255], boldcalibri, true);
        d_index++;
        
        Render.OutlinedString(x - (screensize[0] / 2) + 21, debug_y + 30 + (d_index * 11), 0, "    status: " + dt_shift + " | " + dt_tol + " | " + dt_mupc + " | " + dt_cc, [255,255,255,255], boldcalibri, true);
        d_index++;
    }

    var doubletap_y = debug_y + 30 + (d_index * 11)
    var dt_index = 0

    if (UI.GetValue(visuals_addons) & (1 << 3)) {
        var display_shift = can_doubletap() == true ? Math.round(15 * Exploit.GetCharge()) : 0
        var wm_size = Render.TextSize("[gogi-dt] tickbase: " + display_shift, boldcalibri)
        var charge_bar = Exploit.GetCharge() == 1 ? wm_size[0] + 20 : Exploit.GetCharge() * (wm_size[0] + 20)
        Render.FilledRect(x - (screensize[0] / 2) + 20, doubletap_y + 10, wm_size[0] + 20, 15, [0, 0, 0, 200])
        Render.FilledRect(x - (screensize[0] / 2) + 20, doubletap_y + 25, charge_bar, 2, accent)
        Render.OutlinedString(x - (screensize[0] / 2) + 28, doubletap_y + 11, 0, "[gogi-dt] tickbase: " + display_shift, [255,255,255,255], boldcalibri, true);
    }

    if (UI.GetValue(visuals_style) == 1) {
        var text_size = Render.TextSize("gogi-yaw", boldcalibri)
        Render.OutlinedString(x - (text_size[0] / 4), y + 22, 1, "gogi", aa_side == 1 ? accent : [255,255,255,255], boldcalibri, false)
        Render.OutlinedString(x + (text_size[0] / 4), y + 22, 1, "-yaw", aa_side == -1 ? accent : [255,255,255,255], boldcalibri, false)
        Render.OutlinedString(x, y + 34, 1, vars.status, [255,255,255,255], sp7, false)
    } else if (UI.GetValue(visuals_style) == 2) {
        Render.GradientRect(x - 1, y + 33, dsyrng * 1.25, 2, 1, accent, [0, 0, 0, 55])
        Render.GradientRect(x - (dsyrng * 1.25), y + 33, dsyrng * 1.25, 2, 1, [0, 0, 0, 55], accent)
        Render.OutlinedString(x, y + 20, 1, "gogi-yaw", [255,255,255,255], boldcalibri, false)
    }
}

/*
    Script:
    - Killsay
*/
var killsay = [
    "$$UFF$$ 1tap by gogi-yaw low iq dog (◣_◢)",
    "l2p shit bot hhh raped by gogi-yaw discord.gg/pzjSzscCGd ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "tapped by gogi-yaw sellix.io/Camden (◣_◢)",
    "umad? get good get gogi-yaw ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "u just got your meat beat get good get gogi-yaw ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "so shit even jace could tap you get good get gogi-yaw ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "no gogi-yaw no talk ∩ ( ͡⚆ ͜ʖ ͡⚆) ∩",
    "see yourself get owned at discord.gg/pzjSzscCGd (◣_◢)",
    "off the gogi-yaw @ discord.gg/pzjSzscCGd (◣_◢)",
]

function killsay_and_module_handler() {
    var attacker_id = Entity.GetEntityFromUserID(Event.GetInt("attacker"))
    var target_id = Entity.GetEntityFromUserID(Event.GetInt("userid"))

    if (attacker_id == Entity.GetLocalPlayer() && target_id != Entity.GetLocalPlayer()) {
        //killsay
        if (UI.GetValue(misc_features) & (1 << 0)) {
            Cheat.ExecuteCommand("say " + killsay[RandomInt(0,8)])
        }
    } else if (attacker_id != Entity.GetLocalPlayer() && target_id == Entity.GetLocalPlayer()) {
        // reset module data
        vars.info = []
        vars.hit_side = undefined
        vars.vulnerable = false
    }
}
Cheat.RegisterCallback("player_death", "killsay_and_module_handler");

/*
    Script:
    - Menu
*/

function menu() {
    if (UI.GetValue(master_switch)) {
        // double-tap
        UI.SetEnabled(doubletap_header, 1)
        UI.SetEnabled(doubletap_ovr, 1)
        if (UI.GetValue(doubletap_ovr)) {
            UI.SetEnabled(doubletap_options, 1)
        } else {
            UI.SetEnabled(doubletap_options, 0)
        }
        // anti-aim
        UI.SetEnabled(anti_aim_header, 1)
        UI.SetEnabled(anti_aim, 1)
        if (UI.GetValue(anti_aim)) {
            UI.SetEnabled(anti_aim_opts, 1)
            if ((UI.GetValue(master_switch) & (1 << 0))) {
                UI.SetEnabled(anti_aim_jitter, 1)
            } else {
                UI.SetEnabled(anti_aim_jitter, 0)
            }
            UI.SetEnabled(anti_aim_freestand, 1)
        } else {
            UI.SetEnabled(anti_aim_opts, 0)
            UI.SetEnabled(anti_aim_jitter, 0)
            UI.SetEnabled(anti_aim_freestand, 0)
        }
        // visuals
        UI.SetEnabled(visuals_header, 1)
        UI.SetEnabled(visuals_ovr, 1)
        if (UI.GetValue(visuals_ovr)) {
            UI.SetEnabled(visuals_style, 1)
            UI.SetEnabled(visuals_addons, 1)
            UI.SetEnabled(visuals_accent, 1)
        } else {
            UI.SetEnabled(visuals_style, 0)
            UI.SetEnabled(visuals_addons, 0)
            UI.SetEnabled(visuals_accent, 0)
        }
        // miscellaneous
        UI.SetEnabled(misc_header, 1)
        UI.SetEnabled(misc_ovr, 1)
        if (UI.GetValue(misc_ovr)) {
            UI.SetEnabled(misc_features, 1)
        } else {
            UI.SetEnabled(misc_features, 0)
        }
    } else {
        UI.SetEnabled(doubletap_header, 0)
        UI.SetEnabled(doubletap_ovr, 0)
        UI.SetEnabled(doubletap_options, 0)

        UI.SetEnabled(anti_aim_header, 0)
        UI.SetEnabled(anti_aim, 0)
        UI.SetEnabled(anti_aim_opts, 0)
        UI.SetEnabled(anti_aim_jitter, 0)
        UI.SetEnabled(anti_aim_freestand, 0)

        UI.SetEnabled(visuals_header, 0)
        UI.SetEnabled(visuals_ovr, 0)
        UI.SetEnabled(visuals_style, 0)
        UI.SetEnabled(visuals_addons, 0)
        UI.SetEnabled(visuals_accent, 0)

        UI.SetEnabled(misc_header, 0)
        UI.SetEnabled(misc_ovr, 0)
        UI.SetEnabled(misc_features, 0)
    }
}

/*
    Script:
    - Callbacks
*/

function on_cmove() {
    // helpers
    get_best_enemy()
    // script
    antiaim()
    handle_doubletap()
}
Cheat.RegisterCallback("CreateMove", "on_cmove");

function paint() {
    // helpers
    menu()
    // script
    visuals()
}
Cheat.RegisterCallback("Draw", "paint");