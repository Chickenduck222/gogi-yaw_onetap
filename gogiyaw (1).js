// Welcome Logs
Cheat.PrintLog("-=-=-=-=-=-=-=-=[GOGI-YAW]=-=-=-=-=-=-=-=-", [204, 204, 255, 255])

Cheat.PrintLog("Developed by:", [255, 204, 204, 255])
Cheat.PrintLog("Camden#0948 (Camden)", [235, 235, 235, 255])

Cheat.PrintLog("Current build:", [255, 204, 204, 255])
Cheat.PrintLog("17/04/21 | 9:21 (GMT+10)", [235, 235, 235, 255])

Cheat.PrintLog("-=-=-=-=-=-=-=-=[GOGI-YAW]=-=-=-=-=-=-=-=-", [204, 204, 255, 255])

// Script Setup + Other Shit
var path = ["Rage", "[gogi-yaw]", "SHEET_MGR", "[gogi-yaw]"]
UI.AddSubTab(["Rage", "SUBTAB_MGR"], "[gogi-yaw]")

var script_sep_one = UI.AddSliderInt(path, "", 0, 0);

var rage_dt = UI.AddCheckbox(path, "[gogi] doubletap");
var rage_dt_options = UI.AddDropdown(path, "Doubletap options", ["-", "Latency", "Vulnerability"], 0);
var rage_dt_tick = UI.AddSliderInt(path, "Maximum tickbase", 14, 18);

var script_sep_two = UI.AddSliderInt(path, "", 0, 0);

var rage_tgt = UI.AddCheckbox(path, "[gogi] targetting");
var rage_tgt_options = UI.AddDropdown(path, "Doubletap damage", ["-", "Predict", "HP/2"], 0);
var rage_tgt_dmg = UI.AddSliderInt(path, "Minimum damage override", 1, 130);

var rage_dmg_key = UI.AddHotkey(["Rage", "General", "General", "Key assignment"], "[gogi] damage", "[gogi] damage");

var script_sep_three = UI.AddSliderInt(path, "", 0, 0);

var rage_idt = UI.AddCheckbox(path, "[gogi] ideal tick");
var rage_idt_options = UI.AddMultiDropdown(path, "Ideal tick options", ["Auto direction", "Safepoint unsafe hitboxes", "Min Damage"], 0);
var rage_idt_direction = UI.AddDropdown(path, "Auto direction modes", ["Freestanding", "Edge yaw"], 0);
var rage_idt_dmg = UI.AddSliderInt(path, "Ideal tick min dmg", 1, 130);

var rage_idt_key = UI.AddHotkey(["Rage", "General", "General", "Key assignment"], "[gogi] ideal tick", "[gogi] ideal tick");

var script_sep_four = UI.AddSliderInt(path, "", 0, 0);

var aa_ovr = UI.AddCheckbox(path, "[gogi] antiaim");
var aa_mode = UI.AddDropdown(path, "Angle dictation", ["Prediction", "Bruteforce"], 0);
var aa_prefer = UI.AddMultiDropdown(path, "Antiaim preferences", ["Advanced safety", "Damage prediction", "Avoid high delta", "Jitter legs"], 0);
var aa_fl = UI.AddCheckbox(path, "Dynamic fake-lag");
var aa_avoid_delta = UI.AddSliderInt(path, "Delta deviation", 0, 57);
var aa_ext_ticks = UI.AddSliderInt(path, "Peek prediction", 0, 30);

//var rage_fs_key = UI.AddHotkey(["Rage", "General", "General", "Key assignment"], "[gogi] freestand", "[gogi] freestand");

var script_sep_five = UI.AddSliderInt(path, "", 0, 0);

var vis_enable = UI.AddCheckbox(path, "[gogi] visuals");
var vis_styles = UI.AddDropdown(path, "Indicator styles", ["1 - Primary", "2 - Secondary", "3 - Alternative", "4 - Other"], 0);
var vis_side = UI.AddCheckbox(path, "Indicate side");
var vis_colour_one = UI.AddColorPicker(path, "gogi ~ Primary colour");
var vis_colour_two = UI.AddColorPicker(path, "gogi ~ Secondary colour");
var vis_colour_thr = UI.AddColorPicker(path, "gogi ~ Accent colour");

var script_sep_six = UI.AddSliderInt(path, "", 0, 0);

var misc_enable = UI.AddCheckbox(path, "[gogi] misc");
var misc_autobuy = UI.AddDropdown(path, "Prestart autobuy", ["-", "Awp", "Scout"], 0);
var misc_settings = UI.AddCheckbox(path, "Import recommended settings");

// Script

function menu_dt() {
    if (UI.GetValue(rage_dt)) {
        UI.SetEnabled(rage_dt_options, 1)
        UI.SetEnabled(rage_dt_tick, 1)
    } else {
        UI.SetEnabled(rage_dt_options, 0)
        UI.SetEnabled(rage_dt_tick, 0)
    }
}

var shift = 0
var tol = 0
var mupc = 0

var type = "Default"
function handle_dt() {

    var max_ticks = UI.GetValue(rage_dt_tick)

    var pinglol = Local.Latency();
    var pingmult = pinglol * 1000;
    var pingrounded = Math.round(pingmult);

    var local = Entity.GetLocalPlayer();
    var eye_angles = Local.GetViewAngles();
    left_distance = trace( local, [ 0, eye_angles[1] - 22] );
    right_distance = trace( local, [ 0, eye_angles[1] + 22] );

    if (UI.GetValue(rage_dt)) {
        Exploit.OverrideTolerance(tol)
        Exploit.OverrideShift(shift)
        Exploit.OverrideMaxProcessTicks(mupc);

        if (UI.GetValue(rage_dt_options) == 1) {
            type = "Latency"
            if (pingmult <= 20) {
                shift = max_ticks
                tol = clamp(max_ticks - 16,0,3)
                mupc = 17
            } else if (pingmult <= 40) {
                shift = clamp(max_ticks - 1,14,18)
                tol = 1
                mupc = 16
            } else if (pingmult <= 65) {
                shift = clamp(max_ticks - 2,14,18)
                tol = 1
                mupc = 16
            } else if (pingmult <= 95) {
                shift = 14
                tol = 1
                mupc = 16
            } else {
                shift = 14
                tol = 2
                mupc = 16
            }
        } else if (UI.GetValue(rage_dt_options) == 2) {
            type = "Vulnerability"
            if (right_distance < 750 && left_distance < 750) {
                if (right_distance > left_distance) {
                    shift = clamp(max_ticks - 2,14,18)
                    tol = 1
                    mupc = 16
                } else {
                    shift = clamp(max_ticks - 1,14,18)
                    tol = 1
                    mupc = 16
                }
            } else {
                shift = max_ticks
                tol = clamp(max_ticks - 16,0,3)
                mupc = 17
            }
        } else {
            type = "Default"
            shift = 14
            tol = 1
            mupc = 16
        }
    }
}

function menu_tgt() {
    if (UI.GetValue(rage_tgt)) {
        UI.SetEnabled(rage_tgt_options, 1)
        UI.SetEnabled(rage_tgt_dmg, 1)
    } else {
        UI.SetEnabled(rage_tgt_options, 0)
        UI.SetEnabled(rage_tgt_dmg, 0)
    }
}

function handle_tgt() {

    const enemies = Entity.GetEnemies();
    me = Entity.GetLocalPlayer();
    localwp = Entity.GetWeapon(me);
    wpn = Entity.GetName(localwp);

    if (UI.GetValue(rage_tgt)) {
        if (wpn == "g3sg1" || wpn == "scar20") {
            for (i in enemies) {
                health = Entity.GetProp(enemies[i], "CBasePlayer", "m_iHealth")
                hp = Math.min(health,100)
                if (UI.GetValue(rage_tgt) == 1) {
                    if (hp >= 35) {
                        Ragebot.ForceTargetMinimumDamage(enemies[i], hp / 2)
                    } else {
                        Ragebot.ForceTargetMinimumDamage(enemies[i], hp)
                    }
                } else if (UI.GetValue(rage_tgt) == 2) {
                    Ragebot.ForceTargetMinimumDamage(enemies[i], hp / 2)
                }
            }
        }
    }

    var ovr_dmg = UI.GetValue(rage_tgt_dmg)

    if (UI.GetValue(rage_dmg_key)) {
        for (i in enemies) {
            Ragebot.ForceTargetMinimumDamage(enemies[i], ovr_dmg)
        }
    }
}

function menu_idt() {
    if (UI.GetValue(rage_idt)) {
        UI.SetEnabled(rage_idt_options, 1)
        if (UI.GetValue(rage_idt_options) & (1 << 2)) {
            UI.SetEnabled(rage_idt_dmg, 1)
        } else {
            UI.SetEnabled(rage_idt_dmg, 0)
        }
        if (UI.GetValue(rage_idt_options) & (1 << 0)) {
            UI.SetEnabled(rage_idt_direction, 1)
        } else {
            UI.SetEnabled(rage_idt_direction, 0)
        }
    } else {
        UI.SetEnabled(rage_idt_options, 0)
        UI.SetEnabled(rage_idt_direction, 0)
        UI.SetEnabled(rage_idt_dmg, 0)
    }
}

var ticking = false
function handle_idt() {

    if (UI.GetValue(rage_idt_key) && UI.GetValue(rage_idt)) {
        ticking = true
        if (UI.GetValue(rage_idt_options) & (1 << 0)) {
            freestanding()
        } else {
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0)
        }

        if (UI.GetValue(rage_idt_options) & (1 << 1)) {
            Ragebot.ForceHitboxSafety(0)
            Ragebot.ForceHitboxSafety(1)
            Ragebot.ForceHitboxSafety(12)
            Ragebot.ForceHitboxSafety(11)
        }

        const enemies = Entity.GetEnemies()
        var idt_dmg = UI.GetValue(rage_idt_dmg)

        if (UI.GetValue(rage_idt_options) & (1 << 2)) {
            for (i in enemies) {
                Ragebot.ForceTargetMinimumDamage(enemies[i], idt_dmg)
            }
        }

        if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == false) {
            UI.ToggleHotkey(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"])
        }

        if (UI.GetValue(["Misc.", "Keys", "Key assignment", "Auto peek"]) == false) {
            UI.SetHotkeyState(["Misc.", "Keys", "General", "Key assignment", "Auto peek"], "Toggle")
            UI.ToggleHotkey(["Misc.", "Keys", "General", "Key assignment", "Auto peek"])
        }
    } else {
        if (ticking == true) {
            if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true) {
                UI.ToggleHotkey(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"])
            }
    
            if (UI.GetValue(["Misc.", "Keys", "Key assignment", "Auto peek"]) == true) {
                UI.ToggleHotkey(["Misc.", "Keys", "General", "Key assignment", "Auto peek"])
                UI.SetHotkeyState(["Misc.", "Keys", "General", "Key assignment", "Auto peek"], "Hold")
            }
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0)
            ticking = false
        }
    }
}

function menu_aa() {
    if (UI.GetValue(aa_ovr)) {
        UI.SetEnabled(aa_fl, 1)
        UI.SetEnabled(aa_mode, 1)
        UI.SetEnabled(aa_prefer, 1)
        if (UI.GetValue(aa_prefer) & (1 << 1)) {
            UI.SetEnabled(aa_ext_ticks, 1)
        } else {
            UI.SetEnabled(aa_ext_ticks, 0)
        }
        if (UI.GetValue(aa_prefer) & (1 << 2)) {
            UI.SetEnabled(aa_avoid_delta, 1)
        } else {
            UI.SetEnabled(aa_avoid_delta, 0)
        }
    } else {
        UI.SetEnabled(aa_prefer, 0)
        UI.SetEnabled(aa_mode, 0)
        UI.SetEnabled(aa_fl, 0)
        UI.SetEnabled(aa_avoid_delta, 0)
        UI.SetEnabled(aa_ext_ticks, 0)
    }
}

var status = "default"
var clock = 0
var kill_clock = 0
var fakeoffset = 0
var realoffset = 0
var lbyoffset = 0
var hittable = false
var swap = 0
var yaw_fs = 0
var yaw_aa = 0

function handle_aa() {
    if (UI.GetValue(aa_ovr)) {
        AntiAim.SetOverride(1)
        AntiAim.SetFakeOffset(fakeoffset)
        AntiAim.SetRealOffset(realoffset)
        AntiAim.SetLBYOffset(lbyoffset)

        var me = Entity.GetLocalPlayer()

        var flags = Entity.GetProp(me, "CBasePlayer", "m_fFlags")

        var eye_angles = Local.GetViewAngles()
        distance = trace(me, [ 0, eye_angles[1]])

        me_eyepos = Entity.GetEyePosition(me)
        enemies = Entity.GetEnemies();
        for ( i = 0; i < enemies.length; i++)
        {
            if (Entity.IsValid(enemies[i]) == true && Entity.IsAlive(enemies[i]) && Entity.IsDormant(enemies[i]) == false) {
                hitbox_pos = Entity.GetHitboxPosition(me, 0)
                bot_eyepos = Entity.GetEyePosition(me)
    
                //hb_ext = extrapolate_position(hitbox_pos[0], hitbox_pos[1], hitbox_pos[2], 250, me)
    
                result = Trace.Bullet(enemies[i], me, bot_eyepos, extrapolateHead(enemies[i], UI.GetValue(aa_ext_ticks) * 10))
    
                //Cheat.Print("Trace result:: " + Entity.GetName(enemies[i]) + " can see player: " + Entity.GetName(result[0]) + " damage:: " + result[1] + " visible:: " + result[2] + " hitbox :: " + result[3] + "\n")
    
                if (me == result[0] && (result[1] >= 1 || result[2] == true)) {
                    hittable = true
                } else {
                    hittable = false
                }
            }
        }

        if (has_killed == true) {
            if (kill_clock == 300) {
                kill_clock = 0
                has_killed = false
            } else {
                kill_clock = kill_clock + 1
            }
        }

        if (clock == 3) {
            clock = 0
        } else {
            clock = clock + 1
        }

        if (UI.GetValue(aa_mode) == 0) {
            if ((UI.GetValue(aa_prefer) & (1 << 0)) && get_best_enemy() == undefined) {
                status = "dormant"
                if (clock == 0) {
                    realoffset = -57
                } else if (clock == 1) {
                    realoffset = -57
                } else if (clock == 2) {
                    realoffset = 57
                } else if (clock == 3) {
                    realoffset = 57
                }
                fakeoffset = 0
                lbyoffset = 0
            } else {
                if (has_killed == true) {
                    status = "jitter"
                    if (clock == 0) {
                        realoffset = -57
                    } else if (clock == 1) {
                        realoffset = -57
                    } else if (clock == 2) {
                        realoffset = 57
                    } else if (clock == 3) {
                        realoffset = 57
                    }
                    fakeoffset = 0
                    lbyoffset = 0
                } else {
                    if (misscount >= 1) {
                        status = "indexed"
                        realoffset = clamp(misscount * 15,-57,57)
                        fakeoffset = 0
                        lbyoffset = 0
                    } else {
                        if (lphitcount >= 1) {
                            status = "safety"
                            realoffset = clamp(lphitcount * 10,-57,57)
                            fakeoffset = 0
                            lbyoffset = 0
                        } else {
                            if (UI.GetValue(aa_prefer) & (1 << 0)) {
                                if (flags == 256) {
                                    status = "air"
                                    realoffset = 23
                                    fakeoffset = 0
                                    lbyoffset = 0 
                                } else {
                                    if ((UI.GetValue(aa_prefer) & (1 << 0)) && hittable == true) {
                                        status = "force"
                                        if (clock == 0) {
                                            realoffset = 30
                                        } else if (clock == 1) {
                                            realoffset = 30
                                        } else if (clock == 2) {
                                            realoffset = 45
                                        } else if (clock == 3) {
                                            realoffset = 45
                                        }
                                        fakeoffset = 0
                                        lbyoffset = 0
                                    } else {
                                        if (distance < 460) {
                                            status = "auto"
                                            realoffset = 57 - (distance / 10)
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
                            } else {
                                status = "default"
                                realoffset = 57
                                fakeoffset = 0
                                lbyoffset = 0
                            }
                        }
                    }
                }
            }
        } else if (UI.GetValue(aa_mode) == 1) {
            if (get_best_enemy() == undefined) {
                status = "jitter"

                if (clock == 0) {
                    fakeoffset = -10
                } else if (clock == 1) {
                    fakeoffset = 10
                } else if (clock == 2) {
                    fakeoffset = 10
                } else if (clock == 3) {
                    fakeoffset = -10
                }

                if (clock == 0) {
                    realoffset = -45
                } else if (clock == 1) {
                    realoffset = -45
                } else if (clock == 2) {
                    realoffset = 45
                } else if (clock == 3) {
                    realoffset = 45
                }
                lbyoffset = 0
            } else {
                if (UI.GetValue(aa_prefer) & (1 << 0)) {
                    if (hittable == true) {
                        if (misscount == 0) {
                            status = "indexed"
        
                            if (clock == 0) {
                                fakeoffset = -3
                            } else if (clock == 1) {
                                fakeoffset = 3
                            } else if (clock == 2) {
                                fakeoffset = 3
                            } else if (clock == 3) {
                                fakeoffset = -3
                            }
        
                            realoffset = 42
                            lbyoffset = 0
                        } else if (misscount >= 2) {
                            status = "indexed"
        
                            realoffset = 25
                            fakeoffset = 0
                            lbyoffset = 0
                        } else {
                            status = "indexed"
        
                            if (clock == 0) {
                                fakeoffset = -8
                            } else if (clock == 1) {
                                fakeoffset = -5
                            } else if (clock == 2) {
                                fakeoffset = 5
                            } else if (clock == 3) {
                                fakeoffset = 8
                            }
        
                            realoffset = 32
                            lbyoffset = 0
                        }
                    } else {
                        if (misscount == 0) {
                            status = "default"
                    
                            realoffset = -25
                            fakeoffset = 0
                            lbyoffset = 0
                        } else if (misscount == 1) {
                            status = "left"
                    
                            realoffset = 35
                            fakeoffset = RandomInt(-10,10)
                            lbyoffset = 0
                        } else if (misscount == 2) {
                            status = "right"
                    
                            realoffset = -35
                            fakeoffset = RandomInt(-10,10)
                            lbyoffset = 0
                        } else {
                            status = "indexed"
                    
                            realoffset = clamp(57 - (misscount * 15), -57, 57)
                            fakeoffset = RandomInt(-20,20)
                            lbyoffset = 0
                        }
                    }
                } else {
                    if (misscount == 1) {
                        status = "left"
                
                        realoffset = 35
                        fakeoffset = RandomInt(-10,10)
                        lbyoffset = 0
                    } else if (misscount == 2) {
                        status = "right"
                
                        realoffset = -35
                        fakeoffset = RandomInt(-10,10)
                        lbyoffset = 0
                    } else {
                        status = "default"
                
                        realoffset = clamp(57 - (misscount * 15), -57, 57)
                        fakeoffset = RandomInt(-15,15)
                        lbyoffset = 0
                    }
                }
            }
        }

        if (UI.GetValue(aa_prefer) & (1 << 2)) {
            if (realoffset > UI.GetValue(aa_avoid_delta) || realoffset < (UI.GetValue(aa_avoid_delta) * -1)) {
                realoffset = realoffset / 2
            }
        }

        if (UI.GetValue(aa_prefer) & (1 << 3)) {

            if (swap == 5) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
                swap = 0
            } else {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
                swap = swap + 1
            }

            if (swap == 10) {
                if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 0 ) {
                    UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
                } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 1 ) {
                    UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
                } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 2 ) {
                    UI.SetValue(["Misc.", "Movement", "Leg movement"], 0);
                }
                swap = 0
            } else {
                if (RandomInt(0,15) > 10) {
                    UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
                } else {
                    UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
                }
                swap = swap + 1
            }

            /*if (RandomInt(0,15) > 10) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
            } else {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
            }*/

            /*if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 0 ) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 1);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 1 ) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 2);
            } else if (UI.GetValue(["Misc.", "Movement", "Leg movement"]) == 2 ) {
                UI.SetValue(["Misc.", "Movement", "Leg movement"], 0);
            }*/
        }

        if (UI.GetValue(["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"])) {
            realoffset = realoffset * -1
        }

    } else {
        status = "default"
        AntiAim.SetOverride(0)
    }

    if (right_distance == undefined || left_distance == undefined) {
        is_peek = true
    } else {
        is_peek = false
    }

    /*if (UI.GetValue(rage_fs_key)) {
        freestanding()
    } else {
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0);
    }*/
}

var max_ticks = 0
var tick_clock = 0
var shot_clock = 0
var shot = false
function handle_fl() {
    if (UI.GetValue(aa_ovr)) {
        if (UI.GetValue(aa_fl)) {

            var me = Entity.GetLocalPlayer()

            const firedshots = Entity.GetProp(me, "CCSPlayer", "m_iShotsFired");
            if (firedshots >= 1) {
                shot = true
            }

            if (shot == true) {
                if (shot_clock == 28) {
                    shot_clock = 0
                    shot = false
                } else {
                    shot_clock = shot_clock + 1
                }
            }

            if (shot == true) {
                max_ticks = 0
            } else {
                if (get_velocity(me) >= 255) {
                    max_ticks = 14
                } else {
                    if (tick_clock <= 3) {
                        max_ticks = 0
                        tick_clock = tick_clock + 1
                    } else if (tick_clock == 17) {
                        tick_clock = 0
                    } else {
                        max_ticks = max_ticks + 1
                        tick_clock = tick_clock + 1
                    }
                }
            }

            if (Globals.ChokedCommands() < max_ticks) {
                UserCMD.Choke()
            } else {
                UserCMD.Send()
            }
        }

    }
}

function menu_vis() {
    if (UI.GetValue(vis_enable)) {
        UI.SetEnabled(vis_styles, 1)
        UI.SetEnabled(vis_side, 1)
        UI.SetEnabled(vis_colour_one, 1)
        UI.SetEnabled(vis_colour_two, 1)
        UI.SetEnabled(vis_colour_thr, 1)
    } else {
        UI.SetEnabled(vis_styles, 0)
        UI.SetEnabled(vis_side, 0)
        UI.SetEnabled(vis_colour_one, 0)
        UI.SetEnabled(vis_colour_two, 0)
        UI.SetEnabled(vis_colour_thr, 0)
    }
}

var is_peek = false
function handle_vis() {
    if (UI.GetValue(vis_enable)) {
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
        var colour_one = UI.GetColor(vis_colour_one)
        var colour_two = UI.GetColor(vis_colour_two)
        var colour_three = UI.GetColor(vis_colour_thr)
        var dt_state = charge * 255
        var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
        var dsyrounded = Math.round(dsy);
        var clampeddsy = clamp(dsyrounded, -60, 60);
        var dsyrng = Math.min(Math.abs(Local.GetRealYaw() - Local.GetFakeYaw()) / 2, 60).toFixed(0);

        if (Entity.IsAlive(me) == false)
        return;

        var idt_dmg = UI.GetValue(rage_idt_dmg)

        if (UI.GetValue(rage_idt_options) & (1 << 2)) {
            if (ticking == true) {
                /*Render.String(x - 53, y - 40, 0, "FREESTANDING", [255,255,255,255], boldcalibri);

                Render.Arc(x + 23, y - 35, 4, 0, 90, 360, [0,0,0,5])
                Render.Arc(x + 23, y - 35, 4, 0, 90 + UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) - 12.5, 25, [255,255,255,255])*/

                Render.String(x, y - 30, 1, "CHARGED IDEAL TICK : " + idt_dmg, [255,255,255,255], boldcalibri);
            }
        } else {
            if (ticking == true) {
                /*Render.String(x - 53, y - 40, 0, "FREESTANDING", [255,255,255,255], boldcalibri);

                Render.Arc(x + 23, y - 35, 4, 0, 90, 360, [0,0,0,5])
                Render.Arc(x + 23, y - 35, 4, 0, 90 + UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]), 25, [255,255,255,255])*/

                Render.String(x, y - 30, 1, "CHARGED IDEAL TICK", [255,255,255,255], boldcalibri);
            }
        }

        if (UI.GetValue(vis_side)) {
            if ((status == "indexed"  && is_peek == true) || status == "force") {
                if (dsyrng >= 0) {
                    Render.String(x - 39, y - 12, 0, "<", [0,0,0,155], boldarial );     
                    Render.String(x - 39, y - 13, 0, "<", [255,255,255,255], boldarial );
                    Render.String(x + 27, y - 12, 0, ">>", [0,0,0,155], boldarial );  
                    Render.String(x + 27, y - 13, 0, ">>", colour_one, boldarial );
                } else {
                    Render.String(x + 27, y - 12, 0, ">", [0,0,0,155], boldarial );     
                    Render.String(x + 27, y - 13, 0, ">", [255,255,255,255], boldarial );
                    Render.String(x - 39, y - 12, 0, "<<", [0,0,0,155], boldarial ); 
                    Render.String(x - 39, y - 13, 0, "<<", colour_one, boldarial );  
                }
            } else {
                if ((status == "default" || status == "auto") && is_peek == true) {
                    if (dsyrng >= 0) {
                        Render.String(x - 39, y - 12, 0, "<", [0,0,0,155], boldarial );     
                        Render.String(x - 39, y - 13, 0, "<", [255,255,255,255], boldarial );
                        Render.String(x + 27, y - 12, 0, ">", [0,0,0,155], boldarial );  
                        Render.String(x + 27, y - 13, 0, ">", colour_one, boldarial );
                    } else {
                        Render.String(x + 27, y - 12, 0, ">", [0,0,0,155], boldarial );     
                        Render.String(x + 27, y - 13, 0, ">", [255,255,255,255], boldarial );
                        Render.String(x - 39, y - 12, 0, "<", [0,0,0,155], boldarial ); 
                        Render.String(x - 39, y - 13, 0, "<", colour_one, boldarial );  
                    }
                }
            }
        }

        if (UI.GetValue(vis_styles) == 0) {
            Render.String(x - 1, y + 41, 0, "GOGI-YAW", [0, 0, 0, 255], verdana);
            Render.String(x + 1, y + 39, 0, "GOGI-YAW", [0, 0, 0, 255], verdana);
            Render.String(x, y + 40, 0, "GOGI-YAW", colour_one, verdana);

            Render.String(x - 1, y + 55, 0, "DYNAMIC", [0, 0, 0, 255], verdana);
            Render.String(x + 1, y + 53, 0, "DYNAMIC", [0, 0, 0, 255], verdana);
            Render.String(x, y + 54, 0, "DYNAMIC", colour_two, verdana);

            if (UI.GetValue(["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]) == true) {
                Render.String(x - 1, y + 67, 0, "DT", [0, 0, 0, 255], verdana);
                Render.String(x + 1, y + 65, 0, "DT", [0, 0, 0, 255], verdana);
                Render.String(x, y + 66, 0, "DT", [255 - dt_state,0 + dt_state,0,255], verdana);
            }
        } else if (UI.GetValue(vis_styles) == 1) {
            Render.GradientRect( x + -1, y + 29, dsyrng * 1, 2.8, 1, colour_one, [0, 0, 0, 0]);
            Render.GradientRect( x - -1 - dsyrng * 1, y + 29, dsyrng * 1, 2.8, 1, [0, 0, 0, 0], colour_one);

            Render.String(x + 1, y + 32, 1, "GOGI-YAW", [0,0,0,155], calibri);
            Render.String(x + 0, y + 31, 1, "GOGI-YAW", colour_two, calibri);

            if (dsyrng >= 10) {
                Render.String(x + 7, y + 16, 0, "o", [0,0,0,155], smallercalibri);
                Render.String(x + 6, y + 15, 0, "o", colour_three, smallercalibri);
            } else {
                Render.String(x + 4, y + 16, 0, "o", [0,0,0,155], smallercalibri);
                Render.String(x + 3, y + 15, 0, "o", colour_three, smallercalibri);
            }
            Render.String(x + 1, y + 17, 1, dsyrng + "", [0,0,0,155], calibri);
            Render.String(x + 0, y + 16, 1, dsyrng + "", colour_three, calibri);

            if (misscount >= 1 && status != "jitter") {
                Render.String(x + 1, y + 54, 1, status + " : " + misscount + "", [0,0,0,155], calibri);
                Render.String(x + 0, y + 53, 1, status + " : " + misscount + "", colour_three, calibri);
            } else {
                Render.String(x + 1, y + 54, 1, status + "", [0,0,0,155], calibri);
                Render.String(x + 0, y + 53, 1, status + "", colour_three, calibri);
            }

        } else if (UI.GetValue(vis_styles) == 2) {
            Render.Arc(x - 10,y + 30,8,4,0,360,[0,0,0,15])
            Render.Arc(x - 10,y + 30,8,4,0,dsyrng * 6,colour_one)
        
            Render.String(x - 11, y + 25, 1, dsyrng + "", [0,0,0,255], calibri);
            Render.String(x - 9, y + 23, 1, dsyrng + "", [0,0,0,255], calibri);
            Render.String(x - 10, y + 24, 1, dsyrng + "", [255,255,255,255], calibri);
        
            if (clampeddsy >= 0) {
                Render.Arc(x + 10,y + 30,8,4,0,360,[0,0,0,15])
                Render.Arc(x + 10,y + 30,8,4,270,180,colour_one)
        
                Render.String(x + 10, y + 25, 1, "L", [0,0,0,255], calibri);
                Render.String(x + 8, y + 23, 1, "L", [0,0,0,255], calibri);
                Render.String(x + 9, y + 24, 1, "L", [255,255,255,255], calibri);
            } else {
                Render.Arc(x + 10,y + 30,8,4,0,360,[0,0,0,15])
                Render.Arc(x + 10,y + 30,8,4,90,180,colour_one)
        
                Render.String(x + 11, y + 25, 1, "R", [0,0,0,255], calibri);
                Render.String(x + 9, y + 23, 1, "R", [0,0,0,255], calibri);
                Render.String(x + 10, y + 24, 1, "R", [255,255,255,255], calibri);
            }
        
            Render.String(x + 1, y + 44, 1, "GOGI-YAW", [0,0,0,255], calibri);
            Render.String(x - 1, y + 42, 1, "GOGI-YAW", [0,0,0,255], calibri);
            Render.String(x + 0, y + 43, 1, "GOGI-YAW", colour_two, calibri);
        } else if (UI.GetValue(vis_styles) == 3) {
            const pulse = Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / 0.3)) % (Math.PI * 2))) * 255;

            Render.GradientRect( x + -1, y + 33, dsyrng * 1, 2.8, 1, colour_one, [0, 0, 0, 0]);
            Render.GradientRect( x - -1 - dsyrng * 1, y + 33, dsyrng * 1, 2.8, 1, [0, 0, 0, 0], colour_one);

            Render.String(x + 1, y + 22, 1, "GOGI-YAW", [0,0,0,155], calibri);
            Render.String(x + 0, y + 21, 1, "GOGI-YAW", colour_two, calibri);

            if (misscount >= 1 && status != "jitter") {
                Render.String(x + 1, y + 14, 1, status + " : " + misscount + "", [0,0,0,155], sp7);
                Render.String(x - 1, y + 12, 1, status + " : " + misscount + "", [0,0,0,155], sp7);
                Render.String(x + 0, y + 13, 1, status + " : " + misscount + "", colour_three, sp7);
            } else {
                Render.String(x + 1, y + 14, 1, status + "", [0,0,0,155], sp7);
                Render.String(x - 1, y + 12, 1, status + "", [0,0,0,155], sp7);
                Render.String(x + 0, y + 13, 1, status + "", colour_three, sp7);
            }
        }
    }
}

function menu_msc() {
    if (UI.GetValue(misc_enable)) {
        UI.SetEnabled(misc_autobuy, 1)
        UI.SetEnabled(misc_settings, 1)
    } else {
        UI.SetEnabled(misc_autobuy, 0)
        UI.SetEnabled(misc_settings, 0)
    }
}

function handle_msc() {
    if (UI.GetValue(misc_enable)) {
        if (UI.GetValue(misc_autobuy) == 1) {
            Cheat.ExecuteCommand("buy awp");
        } else if (UI.GetValue(misc_autobuy) == 2) {
            Cheat.ExecuteCommand("buy ssg08");
        }
    }
}
Cheat.RegisterCallback("round_prestart", "handle_msc")

function handle_msc_two() {
    if (UI.GetValue(misc_enable)) {
        if (UI.GetValue(misc_settings)) {
            UI.SetValue(rage_dt, 1)
            UI.SetValue(rage_dt_options, 2)
            UI.SetValue(rage_dt_tick, 17)

            UI.SetValue(rage_tgt, 1)
            UI.SetValue(rage_tgt_options, 1)
            UI.SetValue(rage_tgt_dmg, 1)

            UI.SetValue(rage_idt, 1)
            UI.SetValue(rage_idt_options, (1<<0) + (1<<1) + (1<<2))
            UI.SetValue(rage_idt_dmg, 8)

            UI.SetValue(aa_ovr, 1)
            UI.SetValue(aa_prefer, (1<<0) + (1<<1) + (1<<2) + (1<<3))
            UI.SetValue(aa_fl, 1)
            UI.SetValue(aa_avoid_delta, 10)
            UI.SetValue(aa_ext_ticks, 30)

            UI.SetValue(vis_enable, 1)
            UI.SetValue(vis_styles, 3)
            UI.SetValue(vis_side, 1)
            UI.SetColor(vis_colour_one, [153, 166, 255, 255])
            UI.SetColor(vis_colour_two, [153, 166, 255, 255])
            UI.SetColor(vis_colour_thr, [255, 255, 255, 255])

            UI.SetValue(misc_enable, 1)

            UI.SetValue(misc_settings, 0)
        }
    }
}

function edge_trace( entity_id, entity_angles ) {
    var entity_vec = angle_to_vec( entity_angles[0], entity_angles[1] );
    var entity_pos = Entity.GetRenderOrigin( entity_id );
    entity_pos[0] += 50;
    var stop = [ entity_pos[ 0 ] + entity_vec[0] * 8192, entity_pos[1] + entity_vec[1] * 8192, ( entity_pos[2] )  + entity_vec[2] * 8192 ];
    var traceResult = Trace.Line( entity_id, entity_pos, stop );
    if( !traceResult[0] )
        return;
    stop = [ entity_pos[ 0 ] + entity_vec[0] * traceResult[1] * 8192, entity_pos[1] + entity_vec[1] * traceResult[1] * 8192, entity_pos[2] + entity_vec[2] * traceResult[1] * 8192 ];
    var distance = Math.sqrt( ( entity_pos[0] - stop[0] ) * ( entity_pos[0] - stop[0] ) + ( entity_pos[1] - stop[1] ) * ( entity_pos[1] - stop[1] ) + ( entity_pos[2] - stop[2] ) * ( entity_pos[2] - stop[2] ) );
    entity_pos = Render.WorldToScreen( entity_pos );
    stop = Render.WorldToScreen( stop );
    if( stop[2] != 1 || entity_pos[2] != 1 )
        return;

    return distance;
}

// Dictate Freestanding Conditions
var left_distance = 0
var right_distance = 0
function freestanding() {
    if (UI.GetValue(rage_idt_direction) == 0) {
        var should_left = false
        var should_right = false
    
        var left_dist = false
        var right_dist = false
    
        var dist_right = 0
        var dist_left = 0
    
        UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0)
    
        var me = Entity.GetLocalPlayer()
        var enemies = Entity.GetEnemies()
        var eye_angles = Local.GetViewAngles();
    
        // wall traces here
        left_dist_close = trace( me, [ 0, eye_angles[1] - 55] );
        left_dist_far = trace( me, [ 0, eye_angles[1] - 100] );
        right_dist_close = trace( me, [ 0, eye_angles[1] + 55] );
        right_dist_far = trace( me, [ 0, eye_angles[1] + 100] );
    
        /*if (left_dist_close < 550 || left_dist_far < 550) {
            left_dist = true
        }
    
        if (right_dist_close < 550 || right_dist_far < 550) {
            right_dist = true
        }*/
    
        if (left_dist_far > left_dist_close) {
            dist_left = left_dist_far
        } else {
            dist_left = left_dist_close
        }
    
        if (right_dist_far > right_dist_close) {
            dist_right = right_dist_far
        } else {
            dist_right = right_dist_close
        }
    
        //var max_dist = Math.max(dist_left, dist_right)
    
        /*if (max_dist == left_dist_close || max_dist == left_dist_far) {
            left_dist = true
            right_dist = false
        } else if (max_dist == right_dist_close || max_dist == right_dist_far) {
            right_dist = true
            left_dist = false
        } else {
            left_dist = false
            right_dist = false
        }*/
    
        if (left_dist > right_dist && left_dist < 850) {
            left_dist = true
            right_dist = false
        } else if (right_dist > left_dist && right_dist < 850) {
            left_dist = false
            right_dist = true
        } else {
            left_dist = false
            right_dist = false
        }
    
        /*if (max_dist < 550) {
            if (right_dist > left_dist) {
                right_dist = true
                left_dist = false
            } else if (left_dist > right_dist) {
                right_dist = true
                left_dist = false
            } else {
                right_dist = false
                left_dist = false
            }
        }*/
    
        if (get_best_enemy() == undefined)
        return;
    
        var e_h = Entity.GetHitboxPosition(get_best_enemy(), 0);
        var l_h = Entity.GetHitboxPosition(me, 0);
    
        var e_h_x = e_h[0]
        var l_h_x = l_h[0]
    
        var x_dis = l_h_x - e_h_x
    
        var x_dist = VectorDistance(l_h, e_h)
    
        if (x_dis == NaN || x_dis == undefined) {
            should_left = false
            should_right = false
        } else if (x_dis == 0) {
            should_left = false
            should_right = false
        } else {
            if (x_dis > 0) {
                should_left = false
                should_right = true
            } else {
                should_left = true
                should_right = false
            }
        }
    
        if (right_dist == true && left_dist == true) {
            UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0)
        } else {
            if (right_dist = true) { // && should_left == true
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 90)
            } else if (left_dist == true) { // && should_right == true
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], -90)
            } else {
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0)
            }
        }
    } else if (UI.GetValue(rage_idt_direction) == 1) {
        var me = Entity.GetLocalPlayer()

        var eye_pos = Entity.GetEyePosition(me)
    
        left_distance = edge_trace(me, [0, eye_pos[1] - 10])
        right_distance = edge_trace(me, [0, eye_pos[1] + 10])
    
        if (left_distance < 181 || right_distance < 181) {
            if ((right_distance + 50) > (left_distance - 50)) {
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 0 + normalise_angle(right_distance))
            } else if ((left_distance + 50) > (right_distance - 50)) {
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 180 - normalise_angle(left_distance))
            } else {
                UI.SetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"], 180)
            }
        }
    }
}

/*function freestand_indic() {
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;
    var font_2 = Render.GetFont( "ARIALBD.ttf", 20, true)

    if (UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) == -90) {
        Render.String(x - 41, y - 12, 0, "<", [0,0,0,155], font_2);  
        Render.String(x - 41, y - 12, 0, "<", [55,155,255,255], font_2);
    } else if (UI.GetValue(["Rage", "Anti Aim", "Directions", "Yaw offset"]) == 90) {
        Render.String(x + 41, y - 12, 0, ">", [0,0,0,155], font_2);  
        Render.String(x + 41, y - 12, 0, ">", [55,155,255,255], font_2);
    }
}*/

/*function handle_indicators() {
    var h_index = 0
    var me = Entity.GetLocalPlayer()
    var screensize = Render.GetScreenSize();
    var x = screensize[0]/2;
    var y = screensize[1]/2;
    var font_1 = Render.GetFont( "Calibri.ttf", 11, true)
    var font_2 = Render.GetFont( "ARIALBD.ttf", 10, true)
    var font_3 = Render.GetFont( "EBRIMABD.ttf", 12, true)
    var font_4 = Render.GetFont( "smallest_pixel-7.ttf", 9, true)
    var fake = Local.GetFakeYaw();
    var real = Local.GetRealYaw();
    var dsy2 = Math.min(Math.abs(real - fake) / 2, 60).toFixed(0);
    desync = Number(dsy2);
    var dsy = Local.GetRealYaw() - Local.GetFakeYaw();
    var dsyrounded = Math.round(dsy);
    var clampeddsy = clamp(dsyrounded, -60, 60);
    var choke = Globals.ChokedCommands() * 5
    var choke_two = Globals.ChokedCommands() * 3

    Render.Arc(x - 10,y + 30,8,4,0,360,[0,0,0,15])
    Render.Arc(x - 10,y + 30,8,4,0,desync * 6,[55,155,255,255])

    Render.String(x - 11, y + 25, 1, desync + "", [0,0,0,255], font_1);
    Render.String(x - 9, y + 23, 1, desync + "", [0,0,0,255], font_1);
    Render.String(x - 10, y + 24, 1, desync + "", [255,255,255,255], font_1);

    if (clampeddsy >= 0) {
        Render.Arc(x + 10,y + 30,8,4,0,360,[0,0,0,15])
        Render.Arc(x + 10,y + 30,8,4,270,180,[55,155,255,255])

        Render.String(x + 10, y + 25, 1, "L", [0,0,0,255], font_1);
        Render.String(x + 8, y + 23, 1, "L", [0,0,0,255], font_1);
        Render.String(x + 9, y + 24, 1, "L", [255,255,255,255], font_1);
    } else {
        Render.Arc(x + 10,y + 30,8,4,0,360,[0,0,0,15])
        Render.Arc(x + 10,y + 30,8,4,90,180,[55,155,255,255])

        Render.String(x + 11, y + 25, 1, "R", [0,0,0,255], font_1);
        Render.String(x + 9, y + 23, 1, "R", [0,0,0,255], font_1);
        Render.String(x + 10, y + 24, 1, "R", [255,255,255,255], font_1);
    }

    Render.String(x + 1, y + 44, 1, "GOGI-YAW", [0,0,0,255], font_1);
    Render.String(x - 1, y + 42, 1, "GOGI-YAW", [0,0,0,255], font_1);
    Render.String(x + 0, y + 43, 1, "GOGI-YAW", [255,255,255,255], font_1);
}*/

// Helper functions
function dtr(a) {
    return a / 180 * Math.PI
}

function rtd(a) {
    return a * 180 / Math.PI
}

function extrapolateStomach(ent, ticks) {
    var initialPosition = Entity.GetHitboxPosition(ent, 4);
    var velocity = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]");
    
    var result = [];
    result[0] = initialPosition[0] + velocity[0] * Globals.TickInterval() * ticks;
    result[1] = initialPosition[1] + velocity[1] * Globals.TickInterval() * ticks;
    result[2] = initialPosition[2] + velocity[2] * Globals.TickInterval() * ticks;

    return result;
}

function extrapolateHead(ent, ticks) {
    var initialPosition = Entity.GetHitboxPosition(ent, 0);
    var velocity = Entity.GetProp(ent, "CBasePlayer", "m_vecVelocity[0]");
    
    var result = [];
    result[0] = initialPosition[0] + velocity[0] * Globals.TickInterval() * ticks;
    result[1] = initialPosition[1] + velocity[1] * Globals.TickInterval() * ticks;
    result[2] = initialPosition[2] + velocity[2] * Globals.TickInterval() * ticks;

    return result;
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

function getVelocity() {
    var velocity = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_vecVelocity[0]" );
    var speed = Math.sqrt( velocity[0] * velocity[0] + velocity[1] * velocity[1] );
    return speed;
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

    best_enemy = undefined

    var me = Entity.GetLocalPlayer();
    var enemies = Entity.GetEnemies()
    var best_fov = 180

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
    
            if (cur_fov < best_fov) {
                best_fov = cur_fov
                best_enemy = enemies[i]
            }
        }
    }

    return best_enemy
}

Render.Arc = function(x, y, r1, r2, s, d, col) {
    for (var i = s; i < s + d; i++) {
        const rad = i * Math.PI / 180;

        Render.Line(x + Math.cos(rad) * r1, y + Math.sin(rad) * r1, x + Math.cos(rad) * r2, y + Math.sin(rad) * r2, col);
    }
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
    
    if ((Math.abs(dist) <= 2000)) {
        misscounter = misscounter + 1
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
    if (Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        thitcount = 0
    }
}
Cheat.RegisterCallback("player_death", "thitreset")

var has_killed = false
function thitreset() {
    if (Entity.GetLocalPlayer() == Entity.GetEntityFromUserID(Event.GetInt("attacker")) && Entity.GetLocalPlayer() != Entity.GetEntityFromUserID(Event.GetInt("userid"))) {
        has_killed = true
    }
}
Cheat.RegisterCallback("player_death", "thitreset")

function full_reset() {
    thitcount = 0
    lphitcount = 0
    misscount = 0
}
Cheat.RegisterCallback("round_end", "full_reset")

Render.AddFont = function( name, size, weight ) {
    return Render.GetFont( name.concat( ".ttf" ), size, true ) 
}

// Callbacks
function create_move() {
    handle_dt()
    handle_idt()
    handle_tgt()
    handle_aa()
    handle_fl()
}

// Draw functions here :
function on_paint() {
    menu_dt()
    menu_idt()
    menu_tgt()
    menu_aa()
    menu_vis()
    menu_msc()
    handle_vis()
    handle_msc_two()
}

Cheat.RegisterCallback("CreateMove", "create_move")
Cheat.RegisterCallback("Draw", "on_paint")