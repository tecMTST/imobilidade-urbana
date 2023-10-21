using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapController : MonoBehaviour
{

    public RectTransform[] mapWagons;
    public RectTransform playerMapIcon;



    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetPlayerMapPosition(int index)
    {
        playerMapIcon.SetParent(mapWagons[index], false);


    }
}
