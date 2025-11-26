import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Avatar, AppBar, Toolbar, TextField, Grid, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { Parser } from 'xml2js';

const logos = {
  "BBC One":"https://i.imgur.com/5y3iK8s.png","BBC Two":"https://i.imgur.com/6p0T8nP.png",
  "ITV":"https://i.imgur.com/8jK6v3d.png","Channel 4":"https://i.imgur.com/3bZ3j8g.png",
  "Channel 5":"https://i.imgur.com/9k3l9vX.png","Sky Sports Main Event":"https://i.imgur.com/0lK9v2p.png",
  "Dave":"https://i.imgur.com/7y4k2mJ.png","E4":"https://i.imgur.com/4r8n9vL.png"
};

export default function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://raw.githubusercontent.com/dp247/Freeview-EPG/master/epg.xml")
      .then(r => new Parser().parseStringPromise(r.data))
      .then(res => {
        const progs = (res.tv.programme || []).map(p => ({
          title: p.title?.[0] || "No title",
          channel: p.$.channel,
          start: p.$.start,
          stop: p.$.stop
        }));
        setShows(progs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = shows.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.channel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a1f", color: "#c9d1d9", fontFamily: "Inter" }}>
      <AppBar position="sticky" sx={{ bgcolor: "#161b22" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: "#58a6ff" }}>
            TVSS EPG
          </Typography>
          <TextField size="small" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} 
            sx={{ bgcolor: "#0d1117", borderRadius: 1, input:{color:"#c9d1d9"} }} />
        </Toolbar>
      </AppBar>

      {loading ? <CircularProgress sx={{display:"block",margin:"100px auto"}} /> : (
        <Grid container spacing={2} padding={2}>
          {filtered.slice(0,200).map((s,i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box sx={{ bgcolor: "#161b22", p:2, borderRadius:2, border:"1px solid #30363d" }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar src={logos[s.channel] || "https://via.placeholder.com/60"} />
                  <Box>
                    <Typography fontWeight="bold">{s.channel}</Typography>
                    <Typography variant="body2">{s.title}</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
