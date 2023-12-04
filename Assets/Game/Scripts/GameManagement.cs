using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManagement : MonoBehaviour{

    public static GameManagement Instance;

    public Image panelFadeImage;

    private PlayerController playerController;
    private Vector3 playerInitialPosition;
    

    private void Awake() {
        DontDestroyOnLoad(this.gameObject);

        Instance = this;
    }

    // Start is called before the first frame update
    void Start(){
        playerController = PlayerController.Instance;
        playerInitialPosition = playerController.transform.position;
        
    }

    // Update is called once per frame
    void Update(){
        
    }


    /// <summary>
    /// Sets the player position in the wolrd scene
    /// </summary>
    /// <param name="position" >
    ///     <para>
    ///         The desired position. Initial position by default
    ///     </para>
    ///     <para>
    ///         The Y axis is always the same of initial position
    ///     </para>
    ///</param>
    public void SetPlayerPosition(Vector3 position = new Vector3()) {

        playerController.transform.position = position == new Vector3(0, 0, 0) ? 
                                              playerInitialPosition : new Vector3(position.x, playerInitialPosition.y, position.z);

    }

    //public void StopCoroutines(string name = null) {

    //    if (name != null)
    //        StopAllCoroutines();
    //    else
    //        StopCoroutine(name);

    //}
}
