package ru.boltovka.auth;

import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import java.io.*;import java.net.*;import java.nio.charset.StandardCharsets;import java.util.*;import java.util.regex.*;

public final class BoltovkaAuthPlugin extends JavaPlugin {
  private String site,key;
  public void onEnable(){saveDefaultConfig();site=getConfig().getString("website-url").replaceAll("/$","");key=getConfig().getString("plugin-key");int seconds=getConfig().getInt("poll-seconds",10);Bukkit.getScheduler().runTaskTimerAsynchronously(this,this::poll,60L,Math.max(5,seconds)*20L);}
  private void poll(){try{HttpURLConnection c=(HttpURLConnection)new URL(site+"/api/plugin-pending").openConnection();c.setRequestMethod("GET");c.setRequestProperty("X-Boltovka-Plugin-Key",key);if(c.getResponseCode()!=200)return;String json=read(c.getInputStream());Matcher m=Pattern.compile("\\\"id\\\":\\\"([^\\\"]+)\\\",\\\"nickname\\\":\\\"([^\\\"]+)\\\",\\\"code\\\":\\\"([^\\\"]+)\\\"").matcher(json);List<String> ids=new ArrayList<>();while(m.find()){String id=m.group(1),nick=m.group(2),code=m.group(3);Player p=Bukkit.getOnlinePlayers().stream().filter(x->x.getName().equalsIgnoreCase(nick)).findFirst().orElse(null);if(p!=null&&p.isOnline()){Bukkit.getScheduler().runTask(this,()->p.sendMessage(ChatColor.GOLD+"[BOLTOVKA] "+ChatColor.WHITE+"Ваш код регистрации: "+ChatColor.AQUA+code+ChatColor.GRAY+" (никому не сообщайте)"));ids.add(id);}}if(!ids.isEmpty())ack(ids);}catch(Exception e){getLogger().warning("Auth poll: "+e.getMessage());}}
  private void ack(List<String> ids)throws Exception{HttpURLConnection c=(HttpURLConnection)new URL(site+"/api/plugin-delivered").openConnection();c.setRequestMethod("POST");c.setDoOutput(true);c.setRequestProperty("Content-Type","application/json");c.setRequestProperty("X-Boltovka-Plugin-Key",key);StringBuilder b=new StringBuilder("{\"ids\":[");for(int i=0;i<ids.size();i++){if(i>0)b.append(',');b.append('\"').append(ids.get(i)).append('\"');}b.append("]}");try(OutputStream o=c.getOutputStream()){o.write(b.toString().getBytes(StandardCharsets.UTF_8));}c.getResponseCode();}
  private String read(InputStream in)throws IOException{try(BufferedReader r=new BufferedReader(new InputStreamReader(in,StandardCharsets.UTF_8))){StringBuilder b=new StringBuilder();String s;while((s=r.readLine())!=null)b.append(s);return b.toString();}}
}
