function cross3 (v,a,b) { 
  const ax = a[0]
  const ay = a[1]
  const az = a[2]
  const bx = b[0]
  const by = b[1]
  const bz = b[2]
  v[0] = ay*bz-az*by
  v[1] = az*bx-ax*bz
  v[2] = ax*by-ay*bx
  return v
}
function sub3 (v,a,b) { v[0] = a[0]-b[0]; v[1] = a[1]-b[1]; v[2] = a[2]-b[2]; return v; }
function sum3 (v,a,b) { v[0] = a[0]+b[0]; v[1] = a[1]+b[1]; v[2] = a[2]+b[2]; return v; }
function scl3 (v,c,a) { v[0] = c*a[0];    v[1] = c*a[1];    v[2] = c*a[2];    return v; }
function dot3 (a,b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] }

